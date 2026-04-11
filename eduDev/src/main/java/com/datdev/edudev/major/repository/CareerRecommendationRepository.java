package com.datdev.edudev.major.repository;

import com.datdev.edudev.major.entity.CareerRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRecommendationRepository extends JpaRepository<CareerRecommendation, Long> {
    List<CareerRecommendation> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
