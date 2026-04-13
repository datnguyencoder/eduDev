package com.datdev.edudev.order.dto;

import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotNull(message = "Combo ID is required")
        Long comboId
) {
}
