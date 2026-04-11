package com.datdev.edudev.quiz.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AddQuestionsRequest(
        @NotEmpty List<QuestionDto> questions
) {
}
