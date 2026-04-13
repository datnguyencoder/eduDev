package com.datdev.edudev.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PurchaseHistoryResponse(
        Long enrollmentId,
        Long comboId,
        String comboName,
        String comboThumbnailUrl,
        BigDecimal paidAmount,
        String accessStatus,
        String orderCode,
        Instant purchasedAt
) {
}
