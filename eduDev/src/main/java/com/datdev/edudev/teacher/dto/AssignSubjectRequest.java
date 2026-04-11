package com.datdev.edudev.teacher.dto;

import jakarta.validation.constraints.NotNull;

public record AssignSubjectRequest(
        @NotNull Long teacherId,
        @NotNull Long subjectId
) {
}
