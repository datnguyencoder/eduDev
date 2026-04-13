package com.datdev.edudev.combo.entity;

import com.datdev.edudev.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
@Entity
@Table(name = "enrollments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "combo_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    private Combo combo;

    @Column(name = "enrolled_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant enrolledAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "payment_transaction_id")
    private Long paymentTransactionId;

    @Column(name = "activated_at")
    private Instant activatedAt;

    @Column(name = "expired_at")
    private Instant expiredAt;
}
