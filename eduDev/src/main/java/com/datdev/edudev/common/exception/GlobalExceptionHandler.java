package com.datdev.edudev.common.exception;

import com.datdev.edudev.common.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                exception.getErrorCode(),
                exception.getMessage(),
                request,
                List.of()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        List<ErrorResponse.FieldErrorDetail> fieldErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toFieldError)
                .toList();

        return buildResponse(
                ErrorCode.VALIDATION_ERROR,
                ErrorCode.VALIDATION_ERROR.getMessage(),
                request,
                fieldErrors
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {
        List<ErrorResponse.FieldErrorDetail> fieldErrors = exception.getConstraintViolations()
                .stream()
                .map(violation -> new ErrorResponse.FieldErrorDetail(
                        violation.getPropertyPath().toString(),
                        violation.getMessage()
                ))
                .toList();

        return buildResponse(
                ErrorCode.VALIDATION_ERROR,
                ErrorCode.VALIDATION_ERROR.getMessage(),
                request,
                fieldErrors
        );
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequest(Exception exception, HttpServletRequest request) {
        return buildResponse(
                ErrorCode.MALFORMED_REQUEST,
                ErrorCode.MALFORMED_REQUEST.getMessage(),
                request,
                List.of()
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
            NoResourceFoundException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                ErrorCode.RESOURCE_NOT_FOUND,
                ErrorCode.RESOURCE_NOT_FOUND.getMessage(),
                request,
                List.of()
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {
        return buildResponse(
                ErrorCode.FORBIDDEN,
                ErrorCode.FORBIDDEN.getMessage(),
                request,
                List.of()
        );
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        log.warn("Data integrity violation: {}", exception.getMostSpecificCause().getMessage());
        return buildResponse(
                ErrorCode.DUPLICATE_RESOURCE,
                "A resource with the given unique identifier already exists",
                request,
                List.of()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnhandledException(
            Exception exception,
            HttpServletRequest request
    ) {
        log.error("Unhandled exception caught by global handler", exception);
        return buildResponse(
                ErrorCode.INTERNAL_SERVER_ERROR,
                ErrorCode.INTERNAL_SERVER_ERROR.getMessage(),
                request,
                List.of()
        );
    }

    private ResponseEntity<ErrorResponse> buildResponse(
            ErrorCode errorCode,
            String message,
            HttpServletRequest request,
            List<ErrorResponse.FieldErrorDetail> errors
    ) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ErrorResponse.of(
                        message,
                        errorCode.getCode(),
                        request.getRequestURI(),
                        errors
                ));
    }

    private ErrorResponse.FieldErrorDetail toFieldError(FieldError fieldError) {
        return new ErrorResponse.FieldErrorDetail(
                fieldError.getField(),
                fieldError.getDefaultMessage()
        );
    }
}
