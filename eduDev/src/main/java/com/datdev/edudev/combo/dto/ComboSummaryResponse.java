package com.datdev.edudev.combo.dto;

import java.math.BigDecimal;

public record ComboSummaryResponse(
        Long id,
        String name,
        String description,
        String thumbnailUrl,
        BigDecimal price,
        Integer itemCount
) {
}
