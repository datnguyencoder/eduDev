package com.datdev.edudev.order.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.combo.entity.Combo;
import com.datdev.edudev.combo.repository.ComboRepository;
import com.datdev.edudev.combo.repository.EnrollmentRepository;
import com.datdev.edudev.common.entity.ContentStatus;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.order.dto.CreateOrderRequest;
import com.datdev.edudev.order.dto.OrderResponse;
import com.datdev.edudev.order.dto.OrderSummaryResponse;
import com.datdev.edudev.order.entity.*;
import com.datdev.edudev.order.mapper.OrderMapper;
import com.datdev.edudev.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ComboRepository comboRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderMapper orderMapper;

    public OrderService(
            OrderRepository orderRepository,
            ComboRepository comboRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            OrderMapper orderMapper
    ) {
        this.orderRepository = orderRepository;
        this.comboRepository = comboRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderMapper = orderMapper;
    }

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Student not found"));

        Combo combo = comboRepository.findById(request.comboId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Combo not found"));

        // Validate combo is published
        if (combo.getStatus() != ContentStatus.PUBLISHED) {
            throw new BusinessException(ErrorCode.COMBO_NOT_PURCHASABLE, "Combo is not available for purchase");
        }

        // Validate combo has a price > 0
        if (combo.getPrice() == null || combo.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.COMBO_NOT_PURCHASABLE, "This combo is free. Use direct enrollment instead.");
        }

        // Check if student already enrolled
        if (enrollmentRepository.existsByUserIdAndComboId(userId, combo.getId())) {
            throw new BusinessException(ErrorCode.COMBO_ALREADY_PURCHASED, "You already have access to this combo");
        }

        // Generate unique order code
        String orderCode = generateOrderCode();

        Order order = Order.builder()
                .orderCode(orderCode)
                .student(student)
                .totalAmount(combo.getPrice())
                .currency("VND")
                .status(OrderStatus.PENDING)
                .build();

        OrderItem item = OrderItem.builder()
                .itemType(ItemType.COMBO)
                .itemId(combo.getId())
                .itemNameSnapshot(combo.getName())
                .unitPrice(combo.getPrice())
                .quantity(1)
                .lineTotal(combo.getPrice())
                .build();

        order.addItem(item);

        Order savedOrder = orderRepository.save(order);
        log.info("Order created: orderCode={}, studentId={}, comboId={}, amount={}",
                orderCode, userId, combo.getId(), combo.getPrice());

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getMyOrders(Long userId) {
        return orderMapper.toSummaryResponseList(
                orderRepository.findByStudentIdOrderByCreatedAtDesc(userId)
        );
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByCode(Long userId, String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));

        // Verify the order belongs to this student
        if (!order.getStudent().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You do not have access to this order");
        }

        return orderMapper.toResponse(order);
    }

    /**
     * Mark order as AWAITING_PAYMENT when payment URL is generated.
     */
    @Transactional
    public void markAwaitingPayment(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));
        order.setStatus(OrderStatus.AWAITING_PAYMENT);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);
    }

    /**
     * Mark the order as PAID (called from payment service after successful IPN).
     */
    @Transactional
    public void markPaid(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));
        order.setStatus(OrderStatus.PAID);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);
    }

    /**
     * Mark the order as FAILED.
     */
    @Transactional
    public void markFailed(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));
        if (order.getStatus() == OrderStatus.PAID) {
            return; // Already succeeded, don't downgrade
        }
        order.setStatus(OrderStatus.FAILED);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);
    }

    private String generateOrderCode() {
        String code;
        do {
            code = "EDU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }
}
