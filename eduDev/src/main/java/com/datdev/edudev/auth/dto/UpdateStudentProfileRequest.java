package com.datdev.edudev.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStudentProfileRequest(
        @NotBlank String fullName,
        String avatarUrl,
        String grade,
        Integer targetExamYear,
        String interestedMajors,
        String favoriteSubjects
) {
}
