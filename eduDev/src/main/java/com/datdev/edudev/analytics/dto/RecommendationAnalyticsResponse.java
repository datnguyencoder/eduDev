package com.datdev.edudev.analytics.dto;

import java.util.Map;

public record RecommendationAnalyticsResponse(
        long totalRecommendations,
        long savedRecommendations,
        Map<String, Long> recommendationsByMajor
) {
}
