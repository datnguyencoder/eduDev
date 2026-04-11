package com.datdev.edudev.lesson.dto;

public record UpdateLessonRequest(
        String title,
        String content,
        String summary,
        String difficulty,
        Integer estimatedMinutes,
        Integer displayOrder
) {}
