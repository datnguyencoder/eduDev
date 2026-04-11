package com.datdev.edudev.review.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateReviewRequest(
        Long lessonId,
        Long quizId,
        @NotBlank String status,
        String note
) {
}
