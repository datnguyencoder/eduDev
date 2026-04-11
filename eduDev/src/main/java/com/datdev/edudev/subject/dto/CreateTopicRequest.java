package com.datdev.edudev.subject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTopicRequest(
        @NotNull(message = "Subject ID is required")
        Long subjectId,
        @NotBlank(message = "Topic name is required")
        @Size(max = 255)
        String name,
        String description,
        Integer displayOrder
) {}
