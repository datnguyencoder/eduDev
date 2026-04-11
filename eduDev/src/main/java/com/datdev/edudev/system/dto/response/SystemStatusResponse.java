package com.datdev.edudev.system.dto.response;

import java.time.Instant;
import java.util.List;

public record SystemStatusResponse(
        String application,
        List<String> profiles,
        String authMode,
        Instant timestamp
) {
}
