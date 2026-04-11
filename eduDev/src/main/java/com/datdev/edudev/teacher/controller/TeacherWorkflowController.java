package com.datdev.edudev.teacher.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.teacher.dto.FeedbackResponse;
import com.datdev.edudev.teacher.dto.GiveFeedbackRequest;
import com.datdev.edudev.teacher.dto.TeacherStudentDashboardResponse;
import com.datdev.edudev.teacher.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/teacher")
@Tag(name = "Teacher Workflow", description = "Teacher feedback and student dashboard endpoints")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherWorkflowController {

    private final TeacherService teacherService;

    public TeacherWorkflowController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/feedbacks")
    @Operation(summary = "Create feedback for a student")
    public ApiResponse<FeedbackResponse> createFeedback(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody GiveFeedbackRequest request
    ) {
        return ApiResponse.success("Feedback submitted", teacherService.giveFeedback(userDetails.getUserId(), request));
    }

    @GetMapping("/students/{studentId}/dashboard")
    @Operation(summary = "Get assigned student dashboard")
    public ApiResponse<TeacherStudentDashboardResponse> getStudentDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long studentId
    ) {
        return ApiResponse.success(
                "Student dashboard retrieved",
                teacherService.getStudentDashboard(userDetails.getUserId(), studentId)
        );
    }
}
