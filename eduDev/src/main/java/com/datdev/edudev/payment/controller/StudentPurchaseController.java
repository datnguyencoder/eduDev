package com.datdev.edudev.payment.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.payment.dto.PurchaseHistoryResponse;
import com.datdev.edudev.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/student/purchases")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Purchases", description = "Purchase history for students")
public class StudentPurchaseController {

    private final PaymentService paymentService;

    public StudentPurchaseController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current student's purchase history")
    public ApiResponse<List<PurchaseHistoryResponse>> getMyPurchases(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Purchases retrieved",
                paymentService.getMyPurchases(userDetails.getUserId()));
    }
}
