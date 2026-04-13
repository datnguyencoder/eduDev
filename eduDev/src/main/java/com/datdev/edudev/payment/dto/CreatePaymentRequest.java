package com.datdev.edudev.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePaymentRequest(
        @NotBlank(message = "Order code is required")
        String orderCode
) {
}
