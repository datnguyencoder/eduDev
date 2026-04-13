package com.datdev.edudev.payment.dto;

public record PaymentUrlResponse(
        String paymentUrl,
        String orderCode,
        String txnRef
) {
}
