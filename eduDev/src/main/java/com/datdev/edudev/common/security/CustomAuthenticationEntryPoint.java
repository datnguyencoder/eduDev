package com.datdev.edudev.common.security;

import com.datdev.edudev.common.exception.ErrorCode;
import com.datdev.edudev.common.response.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        ErrorCode errorCode = resolveErrorCode(authException);
        String message = authException.getMessage() == null
                ? errorCode.getMessage()
                : authException.getMessage();

        ErrorResponse errorResponse = ErrorResponse.of(
                message,
                errorCode.getCode(),
                request.getRequestURI(),
                List.of()
        );

        response.setStatus(errorCode.getHttpStatus().value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }

    private ErrorCode resolveErrorCode(AuthenticationException authException) {
        if (authException instanceof JwtAuthenticationException jwtAuthenticationException) {
            return jwtAuthenticationException.getErrorCode();
        }

        return ErrorCode.UNAUTHORIZED;
    }
}
