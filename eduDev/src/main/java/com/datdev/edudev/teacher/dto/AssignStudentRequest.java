package com.datdev.edudev.teacher.dto;

import jakarta.validation.constraints.NotNull;

public record AssignStudentRequest(
        @NotNull Long teacherId,
        @NotNull Long studentId
) {
}
