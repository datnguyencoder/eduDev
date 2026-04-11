package com.datdev.edudev.major.dto;

import jakarta.validation.constraints.NotBlank;

public record MajorUpsertRequest(
        @NotBlank String code,
        @NotBlank String name,
        String description,
        String groupName
) {
}
