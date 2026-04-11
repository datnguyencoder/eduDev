package com.datdev.edudev.quiz.dto;

import jakarta.validation.constraints.NotBlank;

public record ChoiceDto(
        Long id,
        @NotBlank String content,
        Boolean isCorrect,
        Integer displayOrder
) {
}
