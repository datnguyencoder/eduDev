package com.datdev.edudev.quiz.controller;

import com.datdev.edudev.auth.entity.Role;
import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.quiz.dto.*;
import com.datdev.edudev.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/quizzes")
@Tag(name = "Quizzes", description = "Endpoints for quizzes and attempts")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz details (Questions included)")
    public ApiResponse<QuizResponse> getQuiz(@PathVariable Long id) {
        return ApiResponse.success("Quiz retrieved", quizService.getQuizById(id));
    }

    @GetMapping("/lesson/{lessonId}")
    @Operation(summary = "Get published quizzes linked to a specific lesson")
    public ApiResponse<List<QuizSummaryResponse>> getQuizzesByLesson(@PathVariable Long lessonId) {
        return ApiResponse.success("Quizzes retrieved", quizService.getQuizzesByLesson(lessonId));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create a new quiz (Teacher only)")
    public ApiResponse<QuizResponse> createQuiz(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateQuizRequest request
    ) {
        return ApiResponse.success("Quiz created successfully", quizService.createQuiz(userDetails.getUserId(), request));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit quiz attempt and get score (Student only)")
    public ApiResponse<AttemptResponse> submitAttempt(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SubmitAttemptRequest request
    ) {
        return ApiResponse.success("Quiz submitted and graded", quizService.submitAttempt(userDetails.getUserId(), id, request));
    }

    @PostMapping("/{id}/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a quiz attempt using guide-aligned endpoint")
    public ApiResponse<AttemptResponse> createAttempt(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SubmitAttemptRequest request
    ) {
        return ApiResponse.success("Quiz submitted and graded", quizService.submitAttempt(userDetails.getUserId(), id, request));
    }
}
