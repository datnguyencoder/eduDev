package com.datdev.edudev.analytics.dto;

import java.util.Map;

public record ContentAnalyticsResponse(
        long totalLessons,
        long totalQuizzes,
        long totalCombos,
        Map<String, Long> lessonStatuses,
        Map<String, Long> quizStatuses,
        Map<String, Long> comboStatuses
) {
}
