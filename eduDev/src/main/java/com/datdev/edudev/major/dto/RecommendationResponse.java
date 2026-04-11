package com.datdev.edudev.major.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record RecommendationResponse(
        Long id,
        Long studentId,
        Long suggestedMajorId,
        String suggestedMajorName,
        String suggestedMajorCode,
        String reasoning,
        BigDecimal confidenceScore,
        Boolean isSaved,
        Instant createdAt
) {
}
