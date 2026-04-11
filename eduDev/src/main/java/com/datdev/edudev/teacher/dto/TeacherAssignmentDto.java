package com.datdev.edudev.teacher.dto;

import java.time.Instant;

public record TeacherAssignmentDto(
        Long id,
        Long teacherId,
        String teacherName,
        Long targetId,
        String targetName,
        Instant assignedAt,
        String status
) {
}
