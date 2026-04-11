package com.datdev.edudev.auth.controller;

import com.datdev.edudev.auth.dto.TeacherProfileResponse;
import com.datdev.edudev.auth.dto.UpdateTeacherProfileRequest;
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
@RequestMapping("/v1/teachers/me/profile")
@Tag(name = "Teacher Profiles", description = "Self-service teacher profile endpoints")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherProfileController {

    private final UserService userService;

    public TeacherProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get current teacher profile")
    public ApiResponse<TeacherProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.success(
                "Teacher profile retrieved",
                userService.getCurrentTeacherProfile(userDetails.getUserId())
        );
    }

    @PutMapping
    @Operation(summary = "Update current teacher profile")
    public ApiResponse<TeacherProfileResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateTeacherProfileRequest request
    ) {
        return ApiResponse.success(
                "Teacher profile updated",
                userService.updateCurrentTeacherProfile(userDetails.getUserId(), request)
        );
    }
}
