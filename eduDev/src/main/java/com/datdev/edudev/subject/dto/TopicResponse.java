package com.datdev.edudev.subject.dto;

import java.time.Instant;

public record TopicResponse(
        Long id,
        Long subjectId,
        String name,
        String description,
        Integer displayOrder,
        Instant createdAt
) {}
