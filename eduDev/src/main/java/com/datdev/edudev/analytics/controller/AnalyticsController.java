package com.datdev.edudev.analytics.controller;

import com.datdev.edudev.analytics.dto.DashboardStatsResponse;
import com.datdev.edudev.analytics.service.AnalyticsService;
import com.datdev.edudev.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/analytics")
@Tag(name = "Analytics", description = "Endpoints for platform stats and dashboards")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level dashboard statistics (Admin only)")
    public ApiResponse<DashboardStatsResponse> getDashboardStats() {
        return ApiResponse.success("Dashboard stats retrieved", analyticsService.getDashboardStats());
    }
}
