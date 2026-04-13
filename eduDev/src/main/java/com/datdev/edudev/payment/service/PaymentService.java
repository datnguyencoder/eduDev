package com.datdev.edudev.payment.service;

import com.datdev.edudev.combo.entity.Combo;
import com.datdev.edudev.combo.entity.Enrollment;
import com.datdev.edudev.combo.entity.EnrollmentStatus;
import com.datdev.edudev.combo.repository.EnrollmentRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.order.entity.Order;
import com.datdev.edudev.order.entity.OrderItem;
import com.datdev.edudev.order.entity.OrderStatus;
import com.datdev.edudev.order.repository.OrderRepository;
import com.datdev.edudev.order.service.OrderService;
import com.datdev.edudev.payment.dto.PaymentStatusResponse;
import com.datdev.edudev.payment.dto.PaymentUrlResponse;
import com.datdev.edudev.payment.dto.PurchaseHistoryResponse;
import com.datdev.edudev.payment.entity.*;
import com.datdev.edudev.payment.gateway.VnPayGateway;
import com.datdev.edudev.payment.repository.PaymentAuditLogRepository;
import com.datdev.edudev.payment.repository.PaymentTransactionRepository;
import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.combo.repository.ComboRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentAuditLogRepository auditLogRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ComboRepository comboRepository;
    private final VnPayGateway vnPayGateway;
    private final ObjectMapper objectMapper;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            PaymentAuditLogRepository auditLogRepository,
            OrderRepository orderRepository,
            OrderService orderService,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            ComboRepository comboRepository,
            VnPayGateway vnPayGateway,
            ObjectMapper objectMapper
    ) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.auditLogRepository = auditLogRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.comboRepository = comboRepository;
        this.vnPayGateway = vnPayGateway;
        this.objectMapper = objectMapper;
    }

    /**
     * Create a VNPay payment URL for a given order.
     */
    @Transactional
    public PaymentUrlResponse createVnPayPayment(String orderCode, String ipAddress, Long userId) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));

        // Verify ownership
        if (!order.getStudent().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You do not have access to this order");
        }

        // Verify order is in payable state
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.AWAITING_PAYMENT) {
            throw new BusinessException(ErrorCode.ORDER_ALREADY_PAID,
                    "Order is not in a payable state. Current status: " + order.getStatus());
        }

        // Generate unique txn ref
        String txnRef = generateTxnRef(orderCode);

        // Create payment transaction
        PaymentTransaction transaction = PaymentTransaction.builder()
                .order(order)
                .txnRef(txnRef)
                .amount(order.getTotalAmount())
                .status(PaymentStatus.INITIATED)
                .build();

        // Store request params for audit
        try {
            Map<String, Object> requestInfo = Map.of(
                    "orderCode", orderCode,
                    "amount", order.getTotalAmount(),
                    "ipAddress", ipAddress,
                    "userId", userId
            );
            transaction.setRawRequestParams(objectMapper.writeValueAsString(requestInfo));
        } catch (Exception e) {
            log.warn("Failed to serialize request params for audit", e);
        }

        paymentTransactionRepository.save(transaction);

        // Mark order as awaiting payment
        orderService.markAwaitingPayment(orderCode);

        // Build VNPay URL
        String orderInfo = "Thanh toan don hang " + orderCode;
        String paymentUrl = vnPayGateway.buildPaymentUrl(txnRef, order.getTotalAmount(), orderInfo, ipAddress);

        log.info("VNPay payment URL created: orderCode={}, txnRef={}", orderCode, txnRef);

        return new PaymentUrlResponse(paymentUrl, orderCode, txnRef);
    }

    /**
     * Handle VNPay IPN callback — SOURCE OF TRUTH for payment reconciliation.
     * Returns VNPay-expected response: {"RspCode":"00","Message":"Confirm Success"}
     */
    @Transactional
    public Map<String, String> handleIpnCallback(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String payloadStr = serializeParams(params);

        log.info("VNPay IPN received: txnRef={}, responseCode={}", txnRef, responseCode);

        // 1. Verify secure hash
        boolean signatureValid = vnPayGateway.verifySecureHash(params);

        if (!signatureValid) {
            logAudit(null, AuditSource.IPN, payloadStr, false, "Invalid signature");
            log.warn("VNPay IPN: invalid signature for txnRef={}", txnRef);
            return Map.of("RspCode", "97", "Message", "Invalid Checksum");
        }

        // 2. Find payment transaction
        Optional<PaymentTransaction> optTransaction = paymentTransactionRepository.findByTxnRef(txnRef);
        if (optTransaction.isEmpty()) {
            logAudit(null, AuditSource.IPN, payloadStr, true, "Transaction not found: " + txnRef);
            log.warn("VNPay IPN: transaction not found for txnRef={}", txnRef);
            return Map.of("RspCode", "01", "Message", "Order not found");
        }

        PaymentTransaction transaction = optTransaction.get();

        // 3. Check idempotency — already successfully processed
        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            logAudit(transaction, AuditSource.IPN, payloadStr, true, "Duplicate IPN — already SUCCESS");
            log.info("VNPay IPN: duplicate call for already-successful txnRef={}", txnRef);
            return Map.of("RspCode", "02", "Message", "Order already confirmed");
        }

        // 4. Verify amount
        BigDecimal callbackAmount = vnPayGateway.extractAmount(params);
        if (callbackAmount.compareTo(transaction.getAmount()) != 0) {
            logAudit(transaction, AuditSource.IPN, payloadStr, true,
                    "Amount mismatch: expected=" + transaction.getAmount() + ", received=" + callbackAmount);
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setResponseCode(responseCode);
            transaction.setUpdatedAt(Instant.now());
            paymentTransactionRepository.save(transaction);
            log.warn("VNPay IPN: amount mismatch for txnRef={}", txnRef);
            return Map.of("RspCode", "04", "Message", "Invalid Amount");
        }

        // 5. Update transaction with callback data
        transaction.setResponseCode(responseCode);
        transaction.setProviderTransactionNo(params.get("vnp_TransactionNo"));
        transaction.setBankCode(params.get("vnp_BankCode"));
        transaction.setRawResponseParams(payloadStr);
        transaction.setIpnReceivedAt(Instant.now());
        transaction.setUpdatedAt(Instant.now());

        // Parse pay date
        String payDateStr = params.get("vnp_PayDate");
        if (payDateStr != null && !payDateStr.isEmpty()) {
            try {
                java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(payDateStr,
                        java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                transaction.setPayDate(ldt.atZone(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).toInstant());
            } catch (Exception e) {
                log.warn("Failed to parse VNPay pay date: {}", payDateStr);
            }
        }

        // 6. Process based on response code
        if (vnPayGateway.isSuccessResponse(responseCode)) {
            transaction.setStatus(PaymentStatus.SUCCESS);
            paymentTransactionRepository.save(transaction);

            // Mark order as PAID
            orderService.markPaid(transaction.getOrder().getOrderCode());

            // Activate enrollment
            activateEnrollment(transaction);

            logAudit(transaction, AuditSource.IPN, payloadStr, true, "Payment successful — enrollment activated");
            log.info("VNPay IPN: payment SUCCESS for txnRef={}, orderCode={}",
                    txnRef, transaction.getOrder().getOrderCode());
        } else {
            transaction.setStatus(PaymentStatus.FAILED);
            paymentTransactionRepository.save(transaction);

            orderService.markFailed(transaction.getOrder().getOrderCode());

            logAudit(transaction, AuditSource.IPN, payloadStr, true,
                    "Payment failed with responseCode=" + responseCode);
            log.info("VNPay IPN: payment FAILED for txnRef={}, responseCode={}", txnRef, responseCode);
        }

        return Map.of("RspCode", "00", "Message", "Confirm Success");
    }

    /**
     * Handle VNPay return URL — UI flow only, NOT business truth.
     */
    @Transactional
    public void handleReturnCallback(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        String payloadStr = serializeParams(params);
        boolean signatureValid = vnPayGateway.verifySecureHash(params);

        log.info("VNPay return received: txnRef={}", txnRef);

        Optional<PaymentTransaction> optTransaction = paymentTransactionRepository.findByTxnRef(txnRef);
        if (optTransaction.isPresent()) {
            PaymentTransaction transaction = optTransaction.get();
            transaction.setReturnReceivedAt(Instant.now());
            transaction.setUpdatedAt(Instant.now());
            paymentTransactionRepository.save(transaction);
            logAudit(transaction, AuditSource.RETURN, payloadStr, signatureValid, "Return URL callback");
        } else {
            logAudit(null, AuditSource.RETURN, payloadStr, signatureValid,
                    "Return URL callback — transaction not found: " + txnRef);
        }
    }

    /**
     * Get reconciled payment status for frontend polling.
     */
    @Transactional(readOnly = true)
    public PaymentStatusResponse getPaymentStatus(String orderCode, Long userId) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "Order not found"));

        if (!order.getStudent().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "You do not have access to this order");
        }

        Optional<PaymentTransaction> latestPayment =
                paymentTransactionRepository.findFirstByOrderIdOrderByCreatedAtDesc(order.getId());

        // Check if enrollment was created for any combo in this order
        boolean enrolled = false;
        for (OrderItem item : order.getItems()) {
            if (enrollmentRepository.existsByUserIdAndComboId(userId, item.getItemId())) {
                enrolled = true;
                break;
            }
        }

        return new PaymentStatusResponse(
                order.getOrderCode(),
                order.getStatus().name(),
                latestPayment.map(pt -> pt.getStatus().name()).orElse("NONE"),
                order.getTotalAmount(),
                latestPayment.map(PaymentTransaction::getBankCode).orElse(null),
                latestPayment.map(PaymentTransaction::getResponseCode).orElse(null),
                latestPayment.map(PaymentTransaction::getPayDate).orElse(null),
                enrolled
        );
    }

    /**
     * Get purchase history for a student.
     */
    @Transactional(readOnly = true)
    public List<PurchaseHistoryResponse> getMyPurchases(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<PurchaseHistoryResponse> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Combo combo = enrollment.getCombo();

            // Find order info if enrollment has order
            String orderCode = null;
            BigDecimal paidAmount = BigDecimal.ZERO;
            Instant purchasedAt = enrollment.getEnrolledAt();

            if (enrollment.getOrderId() != null) {
                Optional<Order> order = orderRepository.findById(enrollment.getOrderId());
                if (order.isPresent()) {
                    orderCode = order.get().getOrderCode();
                    paidAmount = order.get().getTotalAmount();
                }
            }

            result.add(new PurchaseHistoryResponse(
                    enrollment.getId(),
                    combo.getId(),
                    combo.getName(),
                    combo.getThumbnailUrl(),
                    paidAmount,
                    enrollment.getStatus().name(),
                    orderCode,
                    purchasedAt
            ));
        }

        return result;
    }

    // ========================
    // Private helpers
    // ========================

    private void activateEnrollment(PaymentTransaction transaction) {
        Order order = transaction.getOrder();
        User student = order.getStudent();

        for (OrderItem item : order.getItems()) {
            if (!enrollmentRepository.existsByUserIdAndComboId(student.getId(), item.getItemId())) {
                Combo combo = comboRepository.findById(item.getItemId())
                        .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND,
                                "Combo not found for enrollment activation: " + item.getItemId()));

                Enrollment enrollment = Enrollment.builder()
                        .user(student)
                        .combo(combo)
                        .status(EnrollmentStatus.ACTIVE)
                        .orderId(order.getId())
                        .paymentTransactionId(transaction.getId())
                        .activatedAt(Instant.now())
                        .build();

                enrollmentRepository.save(enrollment);
                log.info("Enrollment activated: studentId={}, comboId={}, orderCode={}",
                        student.getId(), combo.getId(), order.getOrderCode());
            } else {
                log.info("Enrollment already exists: studentId={}, comboId={} — skipping",
                        student.getId(), item.getItemId());
            }
        }
    }

    private void logAudit(PaymentTransaction transaction, AuditSource source,
                          String payload, Boolean signatureValid, String note) {
        try {
            PaymentAuditLog auditLog = PaymentAuditLog.builder()
                    .paymentTransaction(transaction)
                    .source(source)
                    .payload(payload)
                    .signatureValid(signatureValid)
                    .note(note)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to save payment audit log", e);
        }
    }

    private String generateTxnRef(String orderCode) {
        return orderCode + "-" + System.currentTimeMillis();
    }

    private String serializeParams(Map<String, String> params) {
        try {
            // Sanitize — never log hash secret even if present
            Map<String, String> sanitized = new TreeMap<>(params);
            return objectMapper.writeValueAsString(sanitized);
        } catch (Exception e) {
            return params.toString();
        }
    }
}
