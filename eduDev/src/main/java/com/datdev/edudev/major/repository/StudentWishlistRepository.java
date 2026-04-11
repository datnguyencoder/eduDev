package com.datdev.edudev.major.repository;

import com.datdev.edudev.major.entity.StudentWishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentWishlistRepository extends JpaRepository<StudentWishlist, Long> {

    List<StudentWishlist> findByStudentIdOrderByPriorityAsc(Long studentId);

    List<StudentWishlist> findByStudentId(Long studentId);

    Optional<StudentWishlist> findByStudentIdAndMajorId(Long studentId, Long majorId);

    boolean existsByStudentIdAndMajorId(Long studentId, Long majorId);
}
