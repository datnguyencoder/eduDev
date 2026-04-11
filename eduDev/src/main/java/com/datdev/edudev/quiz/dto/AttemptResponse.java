package com.datdev.edudev.quiz.dto;

import java.time.Instant;

public record AttemptResponse(
        Long id,
        Long quizId,
        Long userId,
        Integer score,
        Instant completedAt,
        Boolean passed
) {
}
