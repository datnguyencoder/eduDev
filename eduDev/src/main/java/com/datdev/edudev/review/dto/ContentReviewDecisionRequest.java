package com.datdev.edudev.review.dto;

import jakarta.validation.constraints.NotBlank;

public record ContentReviewDecisionRequest(
        @NotBlank String type,
        String note
) {
}
