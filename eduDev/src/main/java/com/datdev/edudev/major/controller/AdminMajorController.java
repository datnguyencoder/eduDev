package com.datdev.edudev.major.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.major.dto.MajorResponse;
import com.datdev.edudev.major.dto.MajorUpsertRequest;
import com.datdev.edudev.major.service.MajorService;
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
@RequestMapping("/v1/admin/majors")
@Tag(name = "Admin Majors", description = "Admin-only major management endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMajorController {

    private final MajorService majorService;

    public AdminMajorController(MajorService majorService) {
        this.majorService = majorService;
    }

    @PostMapping
    @Operation(summary = "Create a major")
    public ApiResponse<MajorResponse> create(@Valid @RequestBody MajorUpsertRequest request) {
        return ApiResponse.success("Major created successfully", majorService.createMajor(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a major")
    public ApiResponse<MajorResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody MajorUpsertRequest request
    ) {
        return ApiResponse.success("Major updated successfully", majorService.updateMajor(id, request));
    }
}
