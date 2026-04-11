package com.datdev.edudev.system.dto.response;

import java.time.Instant;

public record SecurePingResponse(
        Long userId,
        String email,
        String role,
        Instant timestamp
) {
}
