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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/lessons")
@Tag(name = "Lessons", description = "Endpoints for lessons, bookmarks, and progress")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Get all published lessons for a topic (Authenticated)")
    public ApiResponse<List<LessonResponse>> getLessonsByTopic(@PathVariable Long topicId) {
        return ApiResponse.success("Lessons retrieved successfully", lessonService.getPublishedLessonsByTopic(topicId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lesson details by ID")
    public ApiResponse<LessonResponse> getLessonById(@PathVariable Long id) {
        return ApiResponse.success("Lesson details retrieved", lessonService.getLessonById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create a new lesson (Teacher only)")
    public ApiResponse<LessonResponse> createLesson(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateLessonRequest request
    ) {
        return ApiResponse.success("Lesson created successfully", lessonService.createLesson(userDetails.getUserId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Update an existing lesson (Teacher owner only)")
    public ApiResponse<LessonResponse> updateLesson(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateLessonRequest request
    ) {
        return ApiResponse.success("Lesson updated successfully", lessonService.updateLesson(id, userDetails.getUserId(), request));
    }

    @PostMapping("/{id}/submit-review")
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Submit lesson for review (Teacher owner only)")
    public ApiResponse<LessonResponse> submitForReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Lesson submitted for review", lessonService.submitForReview(id, userDetails.getUserId()));
    }

    @PostMapping("/{id}/bookmark")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Bookmark a lesson (Student only)")
    public ApiResponse<Void> bookmarkLesson(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        lessonService.bookmarkLesson(userDetails.getUserId(), id);
        return ApiResponse.success("Lesson bookmarked", null);
    }

    @DeleteMapping("/{id}/bookmark")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Remove bookmark from a lesson (Student only)")
    public ApiResponse<Void> removeBookmark(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        lessonService.removeBookmark(userDetails.getUserId(), id);
        return ApiResponse.success("Bookmark removed", null);
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Complete a lesson (Student only)")
    public ApiResponse<Void> completeLesson(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        lessonService.completeLesson(userDetails.getUserId(), id);
        return ApiResponse.success("Lesson marked as completed", null);
    }
}
