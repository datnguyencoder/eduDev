package com.datdev.edudev.subject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSubjectRequest(
        @NotBlank(message = "Subject name is required")
        @Size(max = 255)
        String name,
        String description,
        String iconUrl,
        Integer displayOrder
) {}
