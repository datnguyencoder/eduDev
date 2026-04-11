package com.datdev.edudev.system.controller;

import com.datdev.edudev.common.response.ApiResponse;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.system.dto.request.ValidationProbeRequest;
import com.datdev.edudev.system.dto.response.SecurePingResponse;
import com.datdev.edudev.system.dto.response.SystemStatusResponse;
import com.datdev.edudev.system.dto.response.ValidationProbeResponse;
import com.datdev.edudev.system.service.SystemService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/system")
public class SystemController {

    private final SystemService systemService;

    public SystemController(SystemService systemService) {
        this.systemService = systemService;
    }

    @GetMapping("/ping")
    public ApiResponse<SystemStatusResponse> ping() {
        return ApiResponse.success("Phase 1 foundation is ready", systemService.ping());
    }

    @PostMapping("/validation-demo")
    public ApiResponse<ValidationProbeResponse> validationDemo(
            @Valid @RequestBody ValidationProbeRequest request
    ) {
        return ApiResponse.success("Validation passed", systemService.validateEmail(request));
    }

    @GetMapping("/secure-ping")
    public ApiResponse<SecurePingResponse> securePing(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ApiResponse.success("JWT authentication is working", systemService.securePing(currentUser));
    }

    @GetMapping("/business-error")
    public void businessError() {
        systemService.throwBusinessError();
    }
}
