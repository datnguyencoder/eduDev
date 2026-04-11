package com.datdev.edudev.common.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    INTERNAL_SERVER_ERROR("COMMON_001", "Unexpected internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_ERROR("COMMON_002", "Validation failed", HttpStatus.BAD_REQUEST),
    MALFORMED_REQUEST("COMMON_003", "Request body or parameters are invalid", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("COMMON_004", "Resource not found", HttpStatus.NOT_FOUND),
    DUPLICATE_RESOURCE("COMMON_005", "Resource already exists", HttpStatus.CONFLICT),

    // Security
    UNAUTHORIZED("SECURITY_001", "Authentication is required to access this resource", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("SECURITY_002", "You do not have permission to access this resource", HttpStatus.FORBIDDEN),
    INVALID_TOKEN("SECURITY_003", "JWT token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("SECURITY_004", "JWT token has expired", HttpStatus.UNAUTHORIZED),

    // Auth
    EMAIL_ALREADY_EXISTS("AUTH_001", "Email is already registered", HttpStatus.CONFLICT),
    INVALID_CREDENTIALS("AUTH_002", "Invalid email or password", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_REVOKED("AUTH_003", "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
    USER_BANNED("AUTH_004", "User account is banned", HttpStatus.FORBIDDEN),
    USER_INACTIVE("AUTH_005", "User account is inactive", HttpStatus.FORBIDDEN),

    // Content
    INVALID_CONTENT_STATUS("CONTENT_001", "Invalid content status transition", HttpStatus.BAD_REQUEST),
    NOT_CONTENT_OWNER("CONTENT_002", "You are not the owner of this content", HttpStatus.FORBIDDEN),

    // Quiz
    QUIZ_NOT_PUBLISHED("QUIZ_001", "Quiz is not available for attempts", HttpStatus.BAD_REQUEST),
    INVALID_ANSWER_COUNT("QUIZ_002", "Number of answers does not match questions", HttpStatus.BAD_REQUEST),

    // Combo
    ALREADY_ENROLLED("COMBO_001", "Student is already enrolled in this combo", HttpStatus.CONFLICT),

    // Teacher
    ASSIGNMENT_EXISTS("TEACHER_001", "Assignment already exists", HttpStatus.CONFLICT),
    NOT_ASSIGNED("TEACHER_002", "Teacher is not assigned to this resource", HttpStatus.FORBIDDEN);

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
