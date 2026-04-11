package com.datdev.edudev.quiz.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.quiz.dto.AddQuestionsRequest;
import com.datdev.edudev.quiz.dto.CreateQuizRequest;
import com.datdev.edudev.quiz.dto.QuizResponse;
import com.datdev.edudev.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/teacher/quizzes")
@Tag(name = "Teacher Quizzes", description = "Teacher quiz workflow endpoints")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherQuizController {

    private final QuizService quizService;

    public TeacherQuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    @Operation(summary = "Create a quiz")
    public ApiResponse<QuizResponse> createQuiz(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateQuizRequest request
    ) {
        return ApiResponse.success("Quiz created successfully", quizService.createQuiz(userDetails.getUserId(), request));
    }

    @PostMapping("/{id}/questions")
    @Operation(summary = "Add questions to a draft quiz")
    public ApiResponse<QuizResponse> addQuestions(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddQuestionsRequest request
    ) {
        return ApiResponse.success("Questions added successfully", quizService.addQuestions(userDetails.getUserId(), id, request));
    }

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "Submit a quiz for review")
    public ApiResponse<QuizResponse> submitForReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Quiz submitted for review", quizService.submitForReview(userDetails.getUserId(), id));
    }
}
