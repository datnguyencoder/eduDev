package com.datdev.edudev.subject.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.subject.dto.CreateSubjectRequest;
import com.datdev.edudev.subject.dto.SubjectResponse;
import com.datdev.edudev.subject.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/subjects")
@Tag(name = "Subjects", description = "Endpoints for managing subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    @Operation(summary = "Get list of all subjects (Publicly accessible)")
    public ApiResponse<List<SubjectResponse>> getAllSubjects() {
        return ApiResponse.success("Subjects retrieved successfully", subjectService.getAllSubjects());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new subject (Admin only)")
    public ApiResponse<SubjectResponse> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        return ApiResponse.success("Subject created successfully", subjectService.createSubject(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing subject (Admin only)")
    public ApiResponse<SubjectResponse> updateSubject(@PathVariable Long id, @Valid @RequestBody CreateSubjectRequest request) {
        return ApiResponse.success("Subject updated successfully", subjectService.updateSubject(id, request));
    }
}
