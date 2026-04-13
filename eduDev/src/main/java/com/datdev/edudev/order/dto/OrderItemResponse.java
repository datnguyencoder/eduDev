package com.datdev.edudev.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        String itemType,
        Long itemId,
        String itemNameSnapshot,
        BigDecimal unitPrice,
        Integer quantity,
        BigDecimal lineTotal
) {
}
