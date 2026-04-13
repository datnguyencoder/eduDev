package com.datdev.edudev.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "payment_audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_transaction_id")
    private PaymentTransaction paymentTransaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AuditSource source;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(name = "signature_valid")
    private Boolean signatureValid;

    @Column(length = 500)
    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
