package com.datdev.edudev.subject.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.subject.dto.CreateSubjectRequest;
import com.datdev.edudev.subject.dto.SubjectResponse;
import com.datdev.edudev.subject.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin/subjects")
@Tag(name = "Admin Subjects", description = "Admin-only subject management endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubjectController {

    private final SubjectService subjectService;

    public AdminSubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    @Operation(summary = "Create a subject")
    public ApiResponse<SubjectResponse> create(@Valid @RequestBody CreateSubjectRequest request) {
        return ApiResponse.success("Subject created successfully", subjectService.createSubject(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a subject")
    public ApiResponse<SubjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateSubjectRequest request
    ) {
        return ApiResponse.success("Subject updated successfully", subjectService.updateSubject(id, request));
    }
}
