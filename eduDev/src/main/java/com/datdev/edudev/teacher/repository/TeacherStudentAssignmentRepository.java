package com.datdev.edudev.teacher.repository;

import com.datdev.edudev.teacher.entity.TeacherStudentAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherStudentAssignmentRepository extends JpaRepository<TeacherStudentAssignment, Long> {
    List<TeacherStudentAssignment> findByTeacherIdAndStatus(Long teacherId, String status);
    List<TeacherStudentAssignment> findByStudentIdAndStatus(Long studentId, String status);
}
