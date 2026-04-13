package com.datdev.edudev.payment.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.payment.dto.CreatePaymentRequest;
import com.datdev.edudev.payment.dto.PaymentStatusResponse;
import com.datdev.edudev.payment.dto.PaymentUrlResponse;
import com.datdev.edudev.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/student/payments")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Payments", description = "Payment management for students")
public class StudentPaymentController {

    private final PaymentService paymentService;

    public StudentPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/vnpay/create")
    @Operation(summary = "Create VNPay payment URL for an order")
    public ApiResponse<PaymentUrlResponse> createVnPayPayment(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreatePaymentRequest request,
            HttpServletRequest httpRequest
    ) {
        String ipAddress = getClientIpAddress(httpRequest);
        PaymentUrlResponse response = paymentService.createVnPayPayment(
                request.orderCode(), ipAddress, userDetails.getUserId());
        return ApiResponse.success("Payment URL created", response);
    }

    @GetMapping("/orders/{orderCode}/status")
    @Operation(summary = "Get reconciled payment status for an order")
    public ApiResponse<PaymentStatusResponse> getPaymentStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String orderCode
    ) {
        return ApiResponse.success("Payment status retrieved",
                paymentService.getPaymentStatus(orderCode, userDetails.getUserId()));
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
