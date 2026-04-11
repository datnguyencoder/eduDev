package com.datdev.edudev.teacher.dto;

import java.time.Instant;

public record FeedbackResponse(
        Long id,
        Long teacherId,
        String teacherName,
        Long studentId,
        String studentName,
        Long lessonId,
        String lessonTitle,
        String content,
        Integer rating,
        Instant createdAt
) {
}
