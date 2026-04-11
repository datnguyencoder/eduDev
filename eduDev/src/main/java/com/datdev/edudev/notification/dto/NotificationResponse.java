package com.datdev.edudev.notification.dto;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        String title,
        String content,
        String type,
        Boolean isRead,
        Instant createdAt
) {
}
