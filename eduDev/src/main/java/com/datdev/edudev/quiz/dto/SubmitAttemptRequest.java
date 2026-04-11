package com.datdev.edudev.quiz.dto;

import java.util.List;

public record SubmitAttemptRequest(
        List<AnswerSubmissionDto> answers
) {
}
