package com.datdev.edudev.lesson.dto;

import java.time.Instant;

public record LessonResponse(
        Long id,
        Long topicId,
        Long creatorId,
        String title,
        String content,
        String summary,
        String difficulty,
        String status,
        Integer estimatedMinutes,
        Integer displayOrder,
        Instant createdAt,
        Instant updatedAt
) {}
