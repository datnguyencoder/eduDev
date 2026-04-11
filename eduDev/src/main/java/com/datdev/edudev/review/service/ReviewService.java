package com.datdev.edudev.review.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.lesson.repository.LessonRepository;
import com.datdev.edudev.quiz.entity.Quiz;
import com.datdev.edudev.quiz.repository.QuizRepository;
import com.datdev.edudev.review.dto.*;
import com.datdev.edudev.review.entity.ContentReview;
import com.datdev.edudev.review.mapper.ReviewMapper;
import com.datdev.edudev.review.repository.ContentReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
@Service
public class ReviewService {

    private final ContentReviewRepository reviewRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(
            ContentReviewRepository reviewRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            UserRepository userRepository,
            ReviewMapper reviewMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.reviewMapper = reviewMapper;
    }
    public List<PendingContentResponse> getPendingContent() {
        List<PendingContentResponse> pending = new ArrayList<>();
        
        // Load PENDING lessons
        lessonRepository.findByStatus(ContentStatus.PENDING_REVIEW).forEach(l -> {
            pending.add(reviewMapper.lessonToPending(l));
        });

        // Load PENDING quizzes
        quizRepository.findAll().stream()
                .filter(q -> q.getStatus() == ContentStatus.PENDING_REVIEW)
                .forEach(q -> {
                    pending.add(reviewMapper.quizToPending(q));
                });

        return pending;
    }
    @Transactional
    public ReviewResponse processReview(Long reviewerId, CreateReviewRequest request) {
        User reviewer = userRepository.findById(reviewerId).orElseThrow();
        ContentStatus targetStatus = ContentStatus.valueOf(request.status().toUpperCase());

        if (targetStatus != ContentStatus.PUBLISHED && targetStatus != ContentStatus.REJECTED) {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Invalid review status: must be PUBLISHED or REJECTED");
        }

        ContentReview review = ContentReview.builder()
                .reviewer(reviewer)
                .status(targetStatus)
                .note(request.note())
                .build();

        if (request.lessonId() != null) {
            Lesson lesson = lessonRepository.findById(request.lessonId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Lesson not found"));
            lesson.setStatus(targetStatus);
            lessonRepository.save(lesson);
            review.setLesson(lesson);
        } else if (request.quizId() != null) {
            Quiz quiz = quizRepository.findById(request.quizId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz not found"));
            quiz.setStatus(targetStatus);
            quizRepository.save(quiz);
            review.setQuiz(quiz);
        } else {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Must provide lessonId or quizId");
        }

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getReviewHistory(Long lessonId, Long quizId) {
        if (lessonId != null) {
            return reviewMapper.toResponseList(reviewRepository.findByLessonIdOrderByCreatedAtDesc(lessonId));
        } else if (quizId != null) {
            return reviewMapper.toResponseList(reviewRepository.findByQuizIdOrderByCreatedAtDesc(quizId));
        }
        return List.of();
    }

    @Transactional
    public ReviewResponse approveContent(Long reviewerId, Long targetId, String type, String note) {
        return processDecision(reviewerId, targetId, type, ContentStatus.PUBLISHED, note);
    }

    @Transactional
    public ReviewResponse rejectContent(Long reviewerId, Long targetId, String type, String note) {
        return processDecision(reviewerId, targetId, type, ContentStatus.REJECTED, note);
    }

    private ReviewResponse processDecision(
            Long reviewerId,
            Long targetId,
            String type,
            ContentStatus targetStatus,
            String note
    ) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Reviewer not found"));

        ContentReview review = ContentReview.builder()
                .reviewer(reviewer)
                .status(targetStatus)
                .note(note)
                .build();

        if ("LESSON".equalsIgnoreCase(type)) {
            Lesson lesson = lessonRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Lesson not found"));
            if (lesson.getStatus() != ContentStatus.PENDING_REVIEW) {
                throw new BusinessException(ErrorCode.INVALID_CONTENT_STATUS, "Lesson is not pending review");
            }
            lesson.setStatus(targetStatus);
            lessonRepository.save(lesson);
            review.setLesson(lesson);
        } else if ("QUIZ".equalsIgnoreCase(type)) {
            Quiz quiz = quizRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Quiz not found"));
            if (quiz.getStatus() != ContentStatus.PENDING_REVIEW) {
                throw new BusinessException(ErrorCode.INVALID_CONTENT_STATUS, "Quiz is not pending review");
            }
            quiz.setStatus(targetStatus);
            quizRepository.save(quiz);
            review.setQuiz(quiz);
        } else {
            throw new BusinessException(ErrorCode.MALFORMED_REQUEST, "Unsupported content type: " + type);
        }

        return reviewMapper.toResponse(reviewRepository.save(review));
    }
}
