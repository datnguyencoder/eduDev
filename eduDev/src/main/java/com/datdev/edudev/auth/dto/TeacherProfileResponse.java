package com.datdev.edudev.auth.dto;

public record TeacherProfileResponse(
        Long userId,
        String email,
        String fullName,
        String avatarUrl,
        String specialization,
        Integer yearsOfExperience,
        String bio
) {
}
