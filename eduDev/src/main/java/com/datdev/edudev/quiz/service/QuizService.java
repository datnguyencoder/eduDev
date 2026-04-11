package com.datdev.edudev.quiz.service;

import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.quiz.dto.*;
import com.datdev.edudev.quiz.entity.*;
import com.datdev.edudev.quiz.mapper.QuizMapper;
import com.datdev.edudev.quiz.repository.*;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.lesson.repository.LessonRepository;
import com.datdev.edudev.common.kafka.KafkaProducerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final LessonRepository lessonRepository;
    private final QuizMapper quizMapper;
    private final KafkaProducerService kafkaProducerService;

    public QuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizAttemptRepository attemptRepository,
            LessonRepository lessonRepository,
            QuizMapper quizMapper,
            KafkaProducerService kafkaProducerService
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.lessonRepository = lessonRepository;
        this.quizMapper = quizMapper;
        this.kafkaProducerService = kafkaProducerService;
    }

    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz not found"));
        return quizMapper.toResponse(quiz);
    }

    public List<QuizSummaryResponse> getQuizzesByLesson(Long lessonId) {
        List<Quiz> quizzes = quizRepository.findByLessonIdAndStatus(lessonId, ContentStatus.PUBLISHED);
        return quizMapper.toSummaryResponseList(quizzes);
    }
    @Transactional
    public QuizResponse createQuiz(Long creatorId, CreateQuizRequest request) {
        Lesson lesson = null;
        if (request.lessonId() != null) {
            lesson = lessonRepository.findById(request.lessonId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Lesson not found"));
        }

        Quiz quiz = Quiz.builder()
                .lesson(lesson)
                .creatorId(creatorId)
                .title(request.title())
                .description(request.description())
                .timeLimitMinutes(request.timeLimitMinutes())
                .passingScore(request.passingScore() != null ? request.passingScore() : 50)
                .status(ContentStatus.DRAFT)
                .build();

        if (request.questions() != null) {
            request.questions().forEach(questionDto -> quiz.addQuestion(buildQuestion(questionDto)));
        }

        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    @Transactional
    public QuizResponse addQuestions(Long creatorId, Long quizId, AddQuestionsRequest request) {
        Quiz quiz = findQuizOwnedByTeacher(quizId, creatorId);
        if (quiz.getStatus() != ContentStatus.DRAFT && quiz.getStatus() != ContentStatus.REJECTED) {
            throw new BusinessException(
                    ErrorCode.INVALID_CONTENT_STATUS,
                    "Only DRAFT or REJECTED quizzes can be edited"
            );
        }

        request.questions().forEach(questionDto -> quiz.addQuestion(buildQuestion(questionDto)));
        quiz.setUpdatedAt(Instant.now());
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    @Transactional
    public QuizResponse submitForReview(Long creatorId, Long quizId) {
        Quiz quiz = findQuizOwnedByTeacher(quizId, creatorId);
        if (quiz.getStatus() != ContentStatus.DRAFT) {
            throw new BusinessException(
                    ErrorCode.INVALID_CONTENT_STATUS,
                    "Only DRAFT quizzes can be submitted for review"
            );
        }
        quiz.setStatus(ContentStatus.PENDING_REVIEW);
        quiz.setUpdatedAt(Instant.now());
        return quizMapper.toResponse(quizRepository.save(quiz));
    }

    public List<AttemptResponse> getMyAttempts(Long userId) {
        return attemptRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(quizMapper::toAttemptResponse)
                .toList();
    }

    public AttemptResponse getAttemptDetail(Long userId, Long attemptId) {
        QuizAttempt attempt = attemptRepository.findByIdAndUserId(attemptId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz attempt not found"));
        return quizMapper.toAttemptResponse(attempt);
    }
    @Transactional
    public AttemptResponse submitAttempt(Long userId, Long quizId, SubmitAttemptRequest request) {
        Quiz quiz = quizRepository.findByIdAndStatus(quizId, ContentStatus.PUBLISHED)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz not found or not published"));

        if (request.answers() == null || request.answers().size() != quiz.getQuestions().size()) {
            throw new BusinessException(ErrorCode.INVALID_ANSWER_COUNT);
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .userId(userId)
                .build();

        // Load tất cả câu hỏi và đáp án của quiz để chấm điểm
        List<Question> questions = quiz.getQuestions();
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int totalScore = 0;
        
        for (AnswerSubmissionDto submission : request.answers()) {
            Question question = questionMap.get(submission.questionId());
            if (question == null) continue;

            // Tìm choice trong câu hỏi này
            Choice selectedChoice = question.getChoices().stream()
                    .filter(c -> c.getId().equals(submission.choiceId()))
                    .findFirst()
                    .orElseThrow(() -> new BusinessException(ErrorCode.MALFORMED_REQUEST, "Invalid choice for question " + submission.questionId()));

            boolean correct = selectedChoice.getIsCorrect();
            if (correct) {
                totalScore += question.getPoint();
            }

            QuizAnswer answer = QuizAnswer.builder()
                    .question(question)
                    .choice(selectedChoice)
                    .isCorrect(correct)
                    .build();
            attempt.addAnswer(answer);
        }

        // Tính tỉ lệ phần trăm
        int totalPossiblePoints = questions.stream().mapToInt(Question::getPoint).sum();
        int finalScorePercent = totalPossiblePoints > 0 ? (totalScore * 100 / totalPossiblePoints) : 0;

        attempt.setScore(finalScorePercent);
        attempt.setCompletedAt(Instant.now());

        QuizAttempt savedAttempt = attemptRepository.save(attempt);

        // Publish QuizCompletedEvent to Kafka for notification & recommendation engine
        Map<String, Object> eventPayload = new HashMap<>();
        eventPayload.put("userId", userId);
        eventPayload.put("quizId", quizId);
        eventPayload.put("score", finalScorePercent);
        eventPayload.put("passed", finalScorePercent >= quiz.getPassingScore());
        kafkaProducerService.sendEvent("quiz-completed", eventPayload);
        
        return quizMapper.toAttemptResponse(savedAttempt);
    }

    private Quiz findQuizOwnedByTeacher(Long quizId, Long creatorId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz not found"));
        if (!quiz.getCreatorId().equals(creatorId)) {
            throw new BusinessException(ErrorCode.NOT_CONTENT_OWNER);
        }
        return quiz;
    }

    private Question buildQuestion(QuestionDto questionDto) {
        if (questionDto.choices() == null || questionDto.choices().isEmpty()) {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Each question must contain at least one choice");
        }

        long correctChoices = questionDto.choices().stream()
                .filter(choice -> Boolean.TRUE.equals(choice.isCorrect()))
                .count();
        if (correctChoices != 1) {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Each question must have exactly one correct choice");
        }

        Question question = Question.builder()
                .content(questionDto.content())
                .explanation(questionDto.explanation())
                .point(questionDto.point() != null ? questionDto.point() : 1)
                .displayOrder(questionDto.displayOrder() != null ? questionDto.displayOrder() : 0)
                .build();

        questionDto.choices().forEach(choiceDto -> {
            Choice choice = Choice.builder()
                    .content(choiceDto.content())
                    .isCorrect(Boolean.TRUE.equals(choiceDto.isCorrect()))
                    .displayOrder(choiceDto.displayOrder() != null ? choiceDto.displayOrder() : 0)
                    .build();
            question.addChoice(choice);
        });

        return question;
    }
}
