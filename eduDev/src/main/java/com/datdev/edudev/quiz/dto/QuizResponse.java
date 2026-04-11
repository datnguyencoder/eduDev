package com.datdev.edudev.quiz.dto;

import java.util.List;

public record QuizResponse(
        Long id,
        Long lessonId,
        Long creatorId,
        String title,
        String description,
        Integer timeLimitMinutes,
        Integer passingScore,
        String status,
        List<QuestionDto> questions
) {
}
