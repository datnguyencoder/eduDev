package com.datdev.edudev.combo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateComboRequest(
        @NotBlank String name,
        String description,
        String thumbnailUrl,
        @NotNull BigDecimal price,
        List<ComboItemRequest> items
) {
}
