package com.datdev.edudev.teacher.service;

import com.datdev.edudev.auth.entity.User;
import com.datdev.edudev.auth.repository.UserRepository;
import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.lesson.entity.Lesson;
import com.datdev.edudev.lesson.repository.LessonRepository;
import com.datdev.edudev.subject.entity.Subject;
import com.datdev.edudev.subject.repository.SubjectRepository;
import com.datdev.edudev.teacher.dto.*;
import com.datdev.edudev.teacher.entity.*;
import com.datdev.edudev.teacher.mapper.TeacherMapper;
import com.datdev.edudev.teacher.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TeacherService {

    private final TeacherSubjectAssignmentRepository tsRepository;
    private final TeacherStudentAssignmentRepository tstudRepository;
    private final TeacherFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final LessonRepository lessonRepository;
    private final TeacherMapper teacherMapper;

    public TeacherService(
            TeacherSubjectAssignmentRepository tsRepository,
            TeacherStudentAssignmentRepository tstudRepository,
            TeacherFeedbackRepository feedbackRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            LessonRepository lessonRepository,
            TeacherMapper teacherMapper
    ) {
        this.tsRepository = tsRepository;
        this.tstudRepository = tstudRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.lessonRepository = lessonRepository;
        this.teacherMapper = teacherMapper;
    }
    @Transactional
    public TeacherAssignmentDto assignSubject(AssignSubjectRequest request) {
        User teacher = userRepository.findById(request.teacherId()).orElseThrow();
        Subject subject = subjectRepository.findById(request.subjectId()).orElseThrow();

        boolean exists = tsRepository.findByTeacherId(request.teacherId()).stream()
                .anyMatch(assignment -> assignment.getSubject().getId().equals(request.subjectId()));
        if (exists) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_EXISTS);
        }

        TeacherSubjectAssignment assignment = TeacherSubjectAssignment.builder()
                .teacher(teacher)
                .subject(subject)
                .build();

        return teacherMapper.toSubjectAssignmentDto(tsRepository.save(assignment));
    }
    @Transactional
    public TeacherAssignmentDto assignStudent(AssignStudentRequest request) {
        User teacher = userRepository.findById(request.teacherId()).orElseThrow();
        User student = userRepository.findById(request.studentId()).orElseThrow();

        boolean exists = tstudRepository.findByTeacherIdAndStatus(request.teacherId(), "ACTIVE").stream()
                .anyMatch(assignment -> assignment.getStudent().getId().equals(request.studentId()));
        if (exists) {
            throw new BusinessException(ErrorCode.ASSIGNMENT_EXISTS);
        }

        TeacherStudentAssignment assignment = TeacherStudentAssignment.builder()
                .teacher(teacher)
                .student(student)
                .status("ACTIVE")
                .build();

        return teacherMapper.toStudentAssignmentDto(tstudRepository.save(assignment));
    }
    @Transactional
    public FeedbackResponse giveFeedback(Long teacherId, GiveFeedbackRequest request) {
        User teacher = userRepository.findById(teacherId).orElseThrow();
        User student = userRepository.findById(request.studentId()).orElseThrow();
        boolean assigned = tstudRepository.findByTeacherIdAndStatus(teacherId, "ACTIVE").stream()
                .anyMatch(assignment -> assignment.getStudent().getId().equals(request.studentId()));
        if (!assigned) {
            throw new BusinessException(ErrorCode.NOT_ASSIGNED, "Teacher is not assigned to this student");
        }

        Lesson lesson = null;
        if (request.lessonId() != null) {
            lesson = lessonRepository.findById(request.lessonId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Lesson not found"));
        }

        TeacherFeedback feedback = TeacherFeedback.builder()
                .teacher(teacher)
                .student(student)
                .lesson(lesson)
                .content(request.content())
                .rating(request.rating())
                .build();

        return teacherMapper.toFeedbackResponse(feedbackRepository.save(feedback));
    }

    public List<TeacherAssignmentDto> getMyAssignedStudents(Long teacherId) {
        return teacherMapper.toStudentAssignmentDtoList(tstudRepository.findByTeacherIdAndStatus(teacherId, "ACTIVE"));
    }

    public List<FeedbackResponse> getStudentFeedbacks(Long studentId) {
        return teacherMapper.toFeedbackResponseList(feedbackRepository.findByStudentIdOrderByCreatedAtDesc(studentId));
    }

    public TeacherStudentDashboardResponse getStudentDashboard(Long teacherId, Long studentId) {
        boolean assigned = tstudRepository.findByTeacherIdAndStatus(teacherId, "ACTIVE").stream()
                .anyMatch(assignment -> assignment.getStudent().getId().equals(studentId));
        if (!assigned) {
            throw new BusinessException(ErrorCode.NOT_ASSIGNED, "Teacher is not assigned to this student");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Student not found"));
        List<FeedbackResponse> feedbacks = getStudentFeedbacks(studentId);
        return new TeacherStudentDashboardResponse(
                student.getId(),
                student.getFullName(),
                feedbacks.size(),
                feedbacks
        );
    }
}
