package com.datdev.edudev.major.dto;

import java.time.Instant;

public record MajorResponse(
        Long id,
        String code,
        String name,
        String description,
        String groupName,
        Instant createdAt
) {
}
