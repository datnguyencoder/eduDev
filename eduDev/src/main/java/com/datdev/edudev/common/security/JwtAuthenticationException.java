package com.datdev.edudev.common.security;

import com.datdev.edudev.common.exception.ErrorCode;
import org.springframework.security.core.AuthenticationException;

public class JwtAuthenticationException extends AuthenticationException {

    private final ErrorCode errorCode;

    public JwtAuthenticationException(ErrorCode errorCode) {
        this(errorCode, errorCode.getMessage(), null);
    }

    public JwtAuthenticationException(ErrorCode errorCode, String message) {
        this(errorCode, message, null);
    }

    public JwtAuthenticationException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
