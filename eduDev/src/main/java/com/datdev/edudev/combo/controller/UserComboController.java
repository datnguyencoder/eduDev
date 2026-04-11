package com.datdev.edudev.combo.controller;

import com.datdev.edudev.combo.dto.EnrollmentResponse;
import com.datdev.edudev.combo.service.ComboService;
import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/users/me/combos")
@Tag(name = "User Combos", description = "Current user combo enrollments")
@PreAuthorize("hasRole('STUDENT')")
public class UserComboController {

    private final ComboService comboService;

    public UserComboController(ComboService comboService) {
        this.comboService = comboService;
    }

    @GetMapping
    @Operation(summary = "Get current user's combos")
    public ApiResponse<List<EnrollmentResponse>> getMyCombos(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success("Combos retrieved", comboService.getMyEnrollments(userDetails.getUserId()));
    }
}
