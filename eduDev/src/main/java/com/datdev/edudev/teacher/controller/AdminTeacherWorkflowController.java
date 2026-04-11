package com.datdev.edudev.teacher.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.teacher.dto.AssignStudentRequest;
import com.datdev.edudev.teacher.dto.AssignSubjectRequest;
import com.datdev.edudev.teacher.dto.TeacherAssignmentDto;
import com.datdev.edudev.teacher.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin")
@Tag(name = "Admin Teacher Workflow", description = "Admin endpoints for teacher assignments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTeacherWorkflowController {

    private final TeacherService teacherService;

    public AdminTeacherWorkflowController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/teacher-subject-assignments")
    @Operation(summary = "Assign teacher to subject")
    public ApiResponse<TeacherAssignmentDto> assignSubject(@Valid @RequestBody AssignSubjectRequest request) {
        return ApiResponse.success("Subject assigned successfully", teacherService.assignSubject(request));
    }

    @PostMapping("/teacher-student-assignments")
    @Operation(summary = "Assign teacher to student")
    public ApiResponse<TeacherAssignmentDto> assignStudent(@Valid @RequestBody AssignStudentRequest request) {
        return ApiResponse.success("Student assigned successfully", teacherService.assignStudent(request));
    }
}
