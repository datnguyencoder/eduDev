package com.datdev.edudev.quiz.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record QuestionDto(
        Long id,
        @NotBlank String content,
        String explanation,
        Integer point,
        Integer displayOrder,
        List<ChoiceDto> choices
) {
}
