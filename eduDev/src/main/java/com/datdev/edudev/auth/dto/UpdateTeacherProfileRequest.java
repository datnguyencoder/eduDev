package com.datdev.edudev.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateTeacherProfileRequest(
        @NotBlank String fullName,
        String avatarUrl,
        String specialization,
        Integer yearsOfExperience,
        String bio
) {
}
