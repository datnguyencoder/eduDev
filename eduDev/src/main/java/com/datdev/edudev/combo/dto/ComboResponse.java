package com.datdev.edudev.combo.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ComboResponse(
        Long id,
        String name,
        String description,
        String thumbnailUrl,
        BigDecimal price,
        String status,
        List<ComboItemDto> items,
        Instant createdAt
) {
}
