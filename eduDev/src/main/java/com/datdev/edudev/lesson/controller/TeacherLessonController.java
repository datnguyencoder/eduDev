package com.datdev.edudev.lesson.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.lesson.dto.CreateLessonRequest;
import com.datdev.edudev.lesson.dto.LessonResponse;
import com.datdev.edudev.lesson.dto.UpdateLessonRequest;
import com.datdev.edudev.lesson.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/teacher/lessons")
@Tag(name = "Teacher Lessons", description = "Teacher lesson workflow endpoints")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherLessonController {

    private final LessonService lessonService;

    public TeacherLessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping
    @Operation(summary = "Create a lesson")
    public ApiResponse<LessonResponse> createLesson(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateLessonRequest request
    ) {
        return ApiResponse.success("Lesson created successfully", lessonService.createLesson(userDetails.getUserId(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a lesson")
    public ApiResponse<LessonResponse> updateLesson(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateLessonRequest request
    ) {
        return ApiResponse.success("Lesson updated successfully", lessonService.updateLesson(id, userDetails.getUserId(), request));
    }

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "Submit a lesson for review")
    public ApiResponse<LessonResponse> submitForReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Lesson submitted for review", lessonService.submitForReview(id, userDetails.getUserId()));
    }
}
