package com.datdev.edudev.quiz.dto;

public record QuizSummaryResponse(
        Long id,
        Long lessonId,
        String title,
        Integer timeLimitMinutes,
        Integer questionCount
) {
}
