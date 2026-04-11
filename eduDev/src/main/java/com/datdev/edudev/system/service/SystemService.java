package com.datdev.edudev.system.service;

import com.datdev.edudev.common.exception.BusinessException;
import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.common.security.CustomUserDetails;
import com.datdev.edudev.system.dto.request.ValidationProbeRequest;
import com.datdev.edudev.system.dto.response.SecurePingResponse;
import com.datdev.edudev.system.dto.response.SystemStatusResponse;
import com.datdev.edudev.system.dto.response.ValidationProbeResponse;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
public class SystemService {

    private final Environment environment;

    public SystemService(Environment environment) {
        this.environment = environment;
    }

    public SystemStatusResponse ping() {
        return new SystemStatusResponse(
                environment.getProperty("spring.application.name", "eduDev"),
                resolveActiveProfiles(),
                "JWT",
                Instant.now()
        );
    }

    public ValidationProbeResponse validateEmail(ValidationProbeRequest request) {
        return new ValidationProbeResponse(
                request.email(),
                "Validation passed"
        );
    }

    public SecurePingResponse securePing(CustomUserDetails currentUser) {
        return new SecurePingResponse(
                currentUser.getUserId(),
                currentUser.getUsername(),
                currentUser.getRole(),
                Instant.now()
        );
    }

    public void throwBusinessError() {
        throw new BusinessException(
                ErrorCode.RESOURCE_NOT_FOUND,
                "Phase 1 demo resource was not found"
        );
    }

    private List<String> resolveActiveProfiles() {
        String[] activeProfiles = environment.getActiveProfiles();
        if (activeProfiles.length > 0) {
            return Arrays.stream(activeProfiles).toList();
        }

        String[] defaultProfiles = environment.getDefaultProfiles();
        return defaultProfiles.length > 0 ? Arrays.stream(defaultProfiles).toList() : List.of("default");
    }
}
