package com.datdev.edudev.combo.controller;

import com.datdev.edudev.combo.dto.ComboResponse;
import com.datdev.edudev.combo.dto.CreateComboRequest;
import com.datdev.edudev.combo.service.ComboService;
import com.datdev.edudev.common.response.ApiResponse;
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
@RequestMapping("/v1/teacher/combos")
@Tag(name = "Teacher Combos", description = "Teacher combo workflow endpoints")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherComboController {

    private final ComboService comboService;

    public TeacherComboController(ComboService comboService) {
        this.comboService = comboService;
    }

    @PostMapping
    @Operation(summary = "Create a combo")
    public ApiResponse<ComboResponse> createCombo(@Valid @RequestBody CreateComboRequest request) {
        return ApiResponse.success("Combo created successfully", comboService.createCombo(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a combo")
    public ApiResponse<ComboResponse> updateCombo(
            @PathVariable Long id,
            @Valid @RequestBody CreateComboRequest request
    ) {
        return ApiResponse.success("Combo updated successfully", comboService.updateCombo(id, request));
    }

    @PostMapping("/{id}/submit-review")
    @Operation(summary = "Submit a combo for review")
    public ApiResponse<ComboResponse> submitForReview(@PathVariable Long id) {
        return ApiResponse.success("Combo submitted for review", comboService.submitForReview(id));
    }
}
