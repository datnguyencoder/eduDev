package com.datdev.edudev.major.entity;

import com.datdev.edudev.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
@Entity
@Table(name = "student_wishlists", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "major_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentWishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id", nullable = false)
    private Major major;

    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
