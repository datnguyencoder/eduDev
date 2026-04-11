package com.datdev.edudev.combo.repository;

import com.datdev.edudev.combo.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    Optional<Enrollment> findByUserIdAndComboId(Long userId, Long comboId);
    boolean existsByUserIdAndComboId(Long userId, Long comboId);
}
