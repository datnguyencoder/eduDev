package com.datdev.edudev.analytics.dto;

import java.util.Map;

public record DashboardStatsResponse(
        long totalStudents,
        long totalTeachers,
        long totalLessons,
        long totalQuizzes,
        long totalEnrollments,
        long totalQuizAttempts,
        Map<String, Long> ContentDistributionByStatus,
        Map<String, Long> EnrollmentsByStatus
) {}
