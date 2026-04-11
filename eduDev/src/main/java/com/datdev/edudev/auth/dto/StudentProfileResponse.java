package com.datdev.edudev.auth.dto;

public record StudentProfileResponse(
        Long userId,
        String email,
        String fullName,
        String avatarUrl,
        String grade,
        Integer targetExamYear,
        String interestedMajors,
        String favoriteSubjects
) {
}
