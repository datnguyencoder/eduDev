package com.datdev.edudev.auth.dto;

import java.time.Instant;
public record UserMeResponse(
        Long id,
        String email,
        String fullName,
        String avatarUrl,
        String role,
        String status,
        Instant createdAt
) {
}
