package com.datdev.edudev.order.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.order.dto.CreateOrderRequest;
import com.datdev.edudev.order.dto.OrderResponse;
import com.datdev.edudev.order.dto.OrderSummaryResponse;
import com.datdev.edudev.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/student/orders")
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Student Orders", description = "Order management for students")
public class StudentOrderController {

    private final OrderService orderService;

    public StudentOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create a new order for a combo/course")
    public ApiResponse<OrderResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return ApiResponse.success("Order created successfully",
                orderService.createOrder(userDetails.getUserId(), request));
    }

    @GetMapping("/me")
    @Operation(summary = "List current student's orders")
    public ApiResponse<List<OrderSummaryResponse>> getMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Orders retrieved",
                orderService.getMyOrders(userDetails.getUserId()));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Get order detail by order code")
    public ApiResponse<OrderResponse> getOrderDetail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String orderCode
    ) {
        return ApiResponse.success("Order detail retrieved",
                orderService.getOrderByCode(userDetails.getUserId(), orderCode));
    }
}
