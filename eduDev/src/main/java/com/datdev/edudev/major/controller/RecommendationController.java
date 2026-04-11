package com.datdev.edudev.major.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.major.dto.RecommendationRequest;
import com.datdev.edudev.major.dto.RecommendationResponse;
import com.datdev.edudev.major.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/recommendations")
@Tag(name = "Recommendations", description = "Career recommendation endpoints")
@PreAuthorize("hasRole('STUDENT')")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student's recommendations")
    public ApiResponse<List<RecommendationResponse>> getMyRecommendations(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success(
                "Recommendations retrieved",
                recommendationService.getMyRecommendations(userDetails.getUserId())
        );
    }

    @PostMapping("/recalculate")
    @Operation(summary = "Recalculate recommendations")
    public ApiResponse<RecommendationResponse> recalculate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody(required = false) RecommendationRequest request
    ) {
        RecommendationRequest safeRequest = request == null
                ? new RecommendationRequest(null, null)
                : request;
        return ApiResponse.success(
                "Recommendation recalculated",
                recommendationService.generateRecommendation(userDetails.getUserId(), safeRequest)
        );
    }
}
