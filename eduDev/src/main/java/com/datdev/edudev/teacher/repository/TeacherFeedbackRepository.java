package com.datdev.edudev.teacher.repository;

import com.datdev.edudev.teacher.entity.TeacherFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherFeedbackRepository extends JpaRepository<TeacherFeedback, Long> {
    List<TeacherFeedback> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<TeacherFeedback> findByTeacherIdOrderByCreatedAtDesc(Long teacherId);
}
