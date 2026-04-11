package com.datdev.edudev.lesson.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateLessonRequest(
        @NotNull(message = "Topic ID is required")
        Long topicId,
        @NotBlank(message = "Title is required")
        String title,
        String content,
        String summary,
        String difficulty,
        Integer estimatedMinutes,
        Integer displayOrder
) {}
