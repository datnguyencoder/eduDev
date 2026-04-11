package com.datdev.edudev.quiz.mapper;

import com.datdev.edudev.quiz.dto.*;
import com.datdev.edudev.quiz.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuizMapper {

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "status", expression = "java(quiz.getStatus().name())")
    QuizResponse toResponse(Quiz quiz);

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "questionCount", expression = "java(quiz.getQuestions().size())")
    QuizSummaryResponse toSummaryResponse(Quiz quiz);

    QuestionDto toQuestionDto(Question question);
    
    ChoiceDto toChoiceDto(Choice choice);

    @Mapping(target = "quizId", source = "quiz.id")
    @Mapping(target = "passed", expression = "java(attempt.getScore() != null && attempt.getScore() >= attempt.getQuiz().getPassingScore())")
    AttemptResponse toAttemptResponse(QuizAttempt attempt);

    List<QuizSummaryResponse> toSummaryResponseList(List<Quiz> quizzes);
}
