package com.datdev.edudev.subject.dto;

import java.time.Instant;

public record SubjectResponse(
        Long id,
        String name,
        String description,
        String iconUrl,
        Integer displayOrder,
        Instant createdAt
) {}
