package com.datdev.edudev.review.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.review.dto.*;
import com.datdev.edudev.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/reviews")
@Tag(name = "Review Workflow", description = "Endpoints for content moderation and review")
@PreAuthorize("hasRole('ADMIN')") // Default to Admin for all review endpoints
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/pending")
    @Operation(summary = "Get all pending content (Lessons/Quizzes) waiting for review")
    public ApiResponse<List<PendingContentResponse>> getPendingContent() {
        return ApiResponse.success("Pending content retrieved", reviewService.getPendingContent());
    }

    @PostMapping
    @Operation(summary = "Approve or reject a content item (Admin only)")
    public ApiResponse<ReviewResponse> processReview(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        return ApiResponse.success("Review processed successfully", reviewService.processReview(userDetails.getUserId(), request));
    }

    @GetMapping("/history")
    @Operation(summary = "Get review history for a specific lesson or quiz")
    public ApiResponse<List<ReviewResponse>> getReviewHistory(
            @RequestParam(required = false) Long lessonId,
            @RequestParam(required = false) Long quizId
    ) {
        return ApiResponse.success("Review history retrieved", reviewService.getReviewHistory(lessonId, quizId));
    }
}
