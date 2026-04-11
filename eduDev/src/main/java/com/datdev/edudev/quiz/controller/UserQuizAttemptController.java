package com.datdev.edudev.quiz.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.quiz.dto.AttemptResponse;
import com.datdev.edudev.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/users/me/quiz-attempts")
@Tag(name = "Quiz Attempts", description = "Current user quiz attempt history")
@PreAuthorize("hasRole('STUDENT')")
public class UserQuizAttemptController {

    private final QuizService quizService;

    public UserQuizAttemptController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    @Operation(summary = "Get current user's quiz attempts")
    public ApiResponse<List<AttemptResponse>> getMyAttempts(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Quiz attempts retrieved", quizService.getMyAttempts(userDetails.getUserId()));
    }

    @GetMapping("/{attemptId}")
    @Operation(summary = "Get current user's quiz attempt detail")
    public ApiResponse<AttemptResponse> getAttemptDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long attemptId
    ) {
        return ApiResponse.success(
                "Quiz attempt retrieved",
                quizService.getAttemptDetail(userDetails.getUserId(), attemptId)
        );
    }
}
