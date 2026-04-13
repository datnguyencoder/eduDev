package com.datdev.edudev.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentStatusResponse(
        String orderCode,
        String orderStatus,
        String paymentStatus,
        BigDecimal amount,
        String bankCode,
        String responseCode,
        Instant payDate,
        boolean enrolled
) {
}
