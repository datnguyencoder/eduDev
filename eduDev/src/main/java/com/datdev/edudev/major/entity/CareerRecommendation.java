package com.datdev.edudev.major.entity;

import com.datdev.edudev.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
@Entity
@Table(name = "career_recommendations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggested_major_id")
    private Major suggestedMajor;

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "confidence_score")
    private BigDecimal confidenceScore;

    @Column(name = "is_saved", nullable = false)
    @Builder.Default
    private Boolean isSaved = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
