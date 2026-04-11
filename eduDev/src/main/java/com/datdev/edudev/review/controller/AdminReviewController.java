package com.datdev.edudev.review.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.review.dto.ContentReviewDecisionRequest;
import com.datdev.edudev.review.dto.PendingContentResponse;
import com.datdev.edudev.review.dto.ReviewResponse;
import com.datdev.edudev.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/content-reviews")
@Tag(name = "Admin Content Reviews", description = "Admin review queue endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final ReviewService reviewService;

    public AdminReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get pending content reviews")
    public ApiResponse<List<PendingContentResponse>> getPendingReviews() {
        return ApiResponse.success("Pending content retrieved", reviewService.getPendingContent());
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve pending content")
    public ApiResponse<ReviewResponse> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ContentReviewDecisionRequest request
    ) {
        return ApiResponse.success(
                "Content approved",
                reviewService.approveContent(userDetails.getUserId(), id, request.type(), request.note())
        );
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject pending content")
    public ApiResponse<ReviewResponse> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ContentReviewDecisionRequest request
    ) {
        return ApiResponse.success(
                "Content rejected",
                reviewService.rejectContent(userDetails.getUserId(), id, request.type(), request.note())
        );
    }
}
