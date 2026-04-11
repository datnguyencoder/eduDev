package com.datdev.edudev.quiz.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreateQuizRequest(
        Long lessonId,
        @NotBlank String title,
        String description,
        Integer timeLimitMinutes,
        Integer passingScore,
        List<QuestionDto> questions
) {
}
