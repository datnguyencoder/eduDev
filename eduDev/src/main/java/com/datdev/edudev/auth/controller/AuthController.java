package com.datdev.edudev.auth.controller;

import com.datdev.edudev.auth.dto.AuthResponse;
import com.datdev.edudev.auth.dto.LoginRequest;
import com.datdev.edudev.auth.dto.RefreshTokenRequest;
import com.datdev.edudev.auth.dto.StudentRegisterRequest;
import com.datdev.edudev.auth.service.AuthService;
import com.datdev.edudev.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Authentication", description = "Register, login, refresh token, logout")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/student")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register new student account")
    public ApiResponse<AuthResponse> registerStudent(
            @Valid @RequestBody StudentRegisterRequest request
    ) {
        AuthResponse response = authService.registerStudent(request);
        return ApiResponse.success("Student registered successfully", response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ApiResponse<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success("Login successful", response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token (rotation)")
    public ApiResponse<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ApiResponse.success("Token refreshed successfully", response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and revoke refresh token")
    public ApiResponse<Void> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        authService.logout(request);
        return ApiResponse.success("Logged out successfully", null);
    }
}
