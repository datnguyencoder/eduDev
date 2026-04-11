package com.datdev.edudev.combo.entity;

import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.subject.entity.Topic;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "combo_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComboItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    private Combo combo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
