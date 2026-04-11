package com.datdev.edudev.review.mapper;

import com.datdev.edudev.review.dto.*;
import com.datdev.edudev.review.entity.*;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.quiz.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "reviewerId", source = "reviewer.id")
    @Mapping(target = "reviewerName", source = "reviewer.fullName")
    @Mapping(target = "status", expression = "java(review.getStatus().name())")
    @Mapping(target = "targetId", expression = "java(review.getLesson() != null ? review.getLesson().getId() : review.getQuiz().getId())")
    @Mapping(target = "targetType", expression = "java(review.getLesson() != null ? \"LESSON\" : \"QUIZ\")")
    ReviewResponse toResponse(ContentReview review);

    @Mapping(target = "type", constant = "LESSON")
    @Mapping(target = "creatorName", source = "creatorId") // Mocking name lookup or separate logic
    PendingContentResponse lessonToPending(Lesson lesson);

    @Mapping(target = "type", constant = "QUIZ")
    @Mapping(target = "creatorName", source = "creatorId")
    PendingContentResponse quizToPending(Quiz quiz);

    List<ReviewResponse> toResponseList(List<ContentReview> reviews);
}
