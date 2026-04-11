package com.datdev.edudev.combo.controller;

import com.datdev.edudev.combo.dto.*;
import com.datdev.edudev.combo.service.ComboService;
import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/combos")
@Tag(name = "Combos", description = "Endpoints for learning paths and enrollments")
public class ComboController {

    private final ComboService comboService;

    public ComboController(ComboService comboService) {
        this.comboService = comboService;
    }

    @GetMapping
    @Operation(summary = "Get all published combos")
    public ApiResponse<List<ComboSummaryResponse>> getAllCombos() {
        return ApiResponse.success("Combos retrieved", comboService.getPublishedCombos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get combo details (Items included)")
    public ApiResponse<ComboResponse> getCombo(@PathVariable Long id) {
        return ApiResponse.success("Combo details retrieved", comboService.getComboById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    @Operation(summary = "Create a new combo (Teacher/Admin only)")
    public ApiResponse<ComboResponse> createCombo(@Valid @RequestBody CreateComboRequest request) {
        return ApiResponse.success("Combo created successfully", comboService.createCombo(request));
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Enroll in a combo (Student only)")
    public ApiResponse<EnrollmentResponse> enroll(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Enrolled successfully", comboService.enroll(userDetails.getUserId(), id));
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's enrollments with progress")
    public ApiResponse<List<EnrollmentResponse>> getMyEnrollments(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ApiResponse.success("Enrollments retrieved", comboService.getMyEnrollments(userDetails.getUserId()));
    }
}
