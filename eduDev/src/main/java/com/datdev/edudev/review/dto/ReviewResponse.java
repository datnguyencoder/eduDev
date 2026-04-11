package com.datdev.edudev.review.dto;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        Long targetId,
        String targetType,
        Long reviewerId,
        String reviewerName,
        String status,
        String note,
        Instant createdAt
) {
}
