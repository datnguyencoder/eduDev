package com.datdev.edudev.analytics.controller;

import com.datdev.edudev.analytics.dto.ContentAnalyticsResponse;
import com.datdev.edudev.analytics.dto.DashboardStatsResponse;
import com.datdev.edudev.analytics.dto.RecommendationAnalyticsResponse;
import com.datdev.edudev.analytics.service.AnalyticsService;
import com.datdev.edudev.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin")
@Tag(name = "Admin Analytics", description = "Admin dashboard and analytics endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    public AdminAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard stats")
    public ApiResponse<DashboardStatsResponse> getDashboard() {
        return ApiResponse.success("Dashboard stats retrieved", analyticsService.getDashboardStats());
    }

    @GetMapping("/analytics/content")
    @Operation(summary = "Get content analytics")
    public ApiResponse<ContentAnalyticsResponse> getContentAnalytics() {
        return ApiResponse.success("Content analytics retrieved", analyticsService.getContentAnalytics());
    }

    @GetMapping("/analytics/recommendations")
    @Operation(summary = "Get recommendation analytics")
    public ApiResponse<RecommendationAnalyticsResponse> getRecommendationAnalytics() {
        return ApiResponse.success(
                "Recommendation analytics retrieved",
                analyticsService.getRecommendationAnalytics()
        );
    }
}
