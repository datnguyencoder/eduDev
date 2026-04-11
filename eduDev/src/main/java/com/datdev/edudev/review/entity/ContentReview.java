package com.datdev.edudev.review.entity;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.quiz.entity.Quiz;
import com.datdev.edudev.common.entity.ContentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "content_reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContentReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContentStatus status; // Using ContentStatus for simplicity (PUBLISHED/REJECTED)

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
