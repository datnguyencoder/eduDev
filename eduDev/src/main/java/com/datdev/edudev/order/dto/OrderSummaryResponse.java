package com.datdev.edudev.order.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderSummaryResponse(
        Long id,
        String orderCode,
        BigDecimal totalAmount,
        String currency,
        String status,
        int itemCount,
        Instant createdAt
) {
}
