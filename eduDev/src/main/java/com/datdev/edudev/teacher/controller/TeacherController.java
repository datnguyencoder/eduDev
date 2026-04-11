package com.datdev.edudev.teacher.controller;

import com.datdev.edudev.auth.entity.Role;
import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.teacher.dto.*;
import com.datdev.edudev.teacher.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/teachers")
@Tag(name = "Teacher Workflow", description = "Endpoints for teacher assignments and student feedback")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/assignments/subject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign a teacher to a subject (Admin only)")
    public ApiResponse<TeacherAssignmentDto> assignSubject(@Valid @RequestBody AssignSubjectRequest request) {
        return ApiResponse.success("Subject assigned successfully", teacherService.assignSubject(request));
    }

    @PostMapping("/assignments/student")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign a mentor to a student (Admin only)")
    public ApiResponse<TeacherAssignmentDto> assignStudent(@Valid @RequestBody AssignStudentRequest request) {
        return ApiResponse.success("Student assigned successfully", teacherService.assignStudent(request));
    }

    @PostMapping("/feedback")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Give feedback to a student (Teacher only)")
    public ApiResponse<FeedbackResponse> giveFeedback(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody GiveFeedbackRequest request
    ) {
        return ApiResponse.success("Feedback submitted", teacherService.giveFeedback(userDetails.getUserId(), request));
    }

    @GetMapping("/my-students")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Get list of students assigned to the current teacher")
    public ApiResponse<List<TeacherAssignmentDto>> getMyStudents(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success("Assigned students retrieved", teacherService.getMyAssignedStudents(userDetails.getUserId()));
    }

    @GetMapping("/student/{studentId}/feedbacks")
    @Operation(summary = "Get all feedbacks for a specific student")
    public ApiResponse<List<FeedbackResponse>> getStudentFeedbacks(@PathVariable Long studentId) {
        return ApiResponse.success("Student feedbacks retrieved", teacherService.getStudentFeedbacks(studentId));
    }
}
