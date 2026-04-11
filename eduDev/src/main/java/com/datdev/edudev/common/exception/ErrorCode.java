package com.datdev.edudev.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    INTERNAL_SERVER_ERROR("COMMON_001", "Unexpected internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_ERROR("COMMON_002", "Validation failed", HttpStatus.BAD_REQUEST),
    MALFORMED_REQUEST("COMMON_003", "Request body or parameters are invalid", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("COMMON_004", "Resource not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED("SECURITY_001", "Authentication is required to access this resource", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("SECURITY_002", "You do not have permission to access this resource", HttpStatus.FORBIDDEN),
    INVALID_TOKEN("SECURITY_003", "JWT token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("SECURITY_004", "JWT token has expired", HttpStatus.UNAUTHORIZED);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
