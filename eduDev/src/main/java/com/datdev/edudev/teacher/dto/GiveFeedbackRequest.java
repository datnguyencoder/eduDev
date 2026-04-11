package com.datdev.edudev.teacher.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GiveFeedbackRequest(
        @NotNull Long studentId,
        Long lessonId,
        @NotBlank String content,
        @Min(1) @Max(5) Integer rating
) {
}
