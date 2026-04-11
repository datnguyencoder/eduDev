package com.datdev.edudev.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank String fullName,
        String avatarUrl,
        String grade,
        Integer targetExamYear,
        String interestedMajors,
        String favoriteSubjects,
        String specialization,
        Integer yearsOfExperience,
        String bio
) {}
