package com.datdev.edudev.teacher.entity;

import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
@Entity
@Table(name = "teacher_subject_assignments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"teacher_id", "subject_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeacherSubjectAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "assigned_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant assignedAt = Instant.now();
}
