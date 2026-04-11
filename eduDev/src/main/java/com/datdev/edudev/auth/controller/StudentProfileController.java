package com.datdev.edudev.auth.controller;

import com.datdev.edudev.auth.dto.StudentProfileResponse;
import com.datdev.edudev.auth.dto.UpdateStudentProfileRequest;
import com.datdev.edudev.auth.service.UserService;
import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/students/me/profile")
@Tag(name = "Student Profiles", description = "Self-service student profile endpoints")
@PreAuthorize("hasRole('STUDENT')")
public class StudentProfileController {

    private final UserService userService;

    public StudentProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get current student profile")
    public ApiResponse<StudentProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success(
                "Student profile retrieved",
                userService.getCurrentStudentProfile(userDetails.getUserId())
        );
    }

    @PutMapping
    @Operation(summary = "Update current student profile")
    public ApiResponse<StudentProfileResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateStudentProfileRequest request
    ) {
        return ApiResponse.success(
                "Student profile updated",
                userService.updateCurrentStudentProfile(userDetails.getUserId(), request)
        );
    }
}
