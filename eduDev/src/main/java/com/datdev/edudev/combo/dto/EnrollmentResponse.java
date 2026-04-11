package com.datdev.edudev.combo.dto;

import java.time.Instant;

public record EnrollmentResponse(
        Long id,
        Long comboId,
        String comboName,
        Instant enrolledAt,
        String status,
        Double progressPercent
) {
}
