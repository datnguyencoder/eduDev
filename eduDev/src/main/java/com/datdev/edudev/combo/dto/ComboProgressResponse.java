package com.datdev.edudev.combo.dto;

import java.time.Instant;

public record ComboProgressResponse(
        Long lessonId,
        String lessonTitle,
        Boolean completed,
        Instant completedAt
) {
}
