package com.datdev.edudev.payment.entity;

import com.datdev.edudev.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String provider = "VNPAY";

    @Column(name = "txn_ref", nullable = false, unique = true, length = 100)
    private String txnRef;

    @Column(name = "provider_transaction_no", length = 100)
    private String providerTransactionNo;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.INITIATED;

    @Column(name = "bank_code", length = 50)
    private String bankCode;

    @Column(name = "response_code", length = 10)
    private String responseCode;

    @Column(name = "pay_date")
    private Instant payDate;

    @Column(name = "raw_request_params", columnDefinition = "TEXT")
    private String rawRequestParams;

    @Column(name = "raw_response_params", columnDefinition = "TEXT")
    private String rawResponseParams;

    @Column(name = "ipn_received_at")
    private Instant ipnReceivedAt;

    @Column(name = "return_received_at")
    private Instant returnReceivedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
