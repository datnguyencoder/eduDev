package com.datdev.edudev.review.dto;

import java.time.Instant;

public record PendingContentResponse(
        Long id,
        String title,
        String type,
        Long creatorId,
        String creatorName,
        Instant updatedAt
) {
}
