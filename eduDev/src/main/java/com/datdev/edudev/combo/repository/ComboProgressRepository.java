package com.datdev.edudev.combo.repository;

import com.datdev.edudev.combo.entity.ComboProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComboProgressRepository extends JpaRepository<ComboProgress, Long> {
    List<ComboProgress> findByEnrollmentId(Long enrollmentId);
    Optional<ComboProgress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);
}
