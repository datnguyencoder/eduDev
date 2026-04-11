package com.datdev.edudev.common.response;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(
        boolean success,
        String message,
        String errorCode,
        String path,
        Instant timestamp,
        List<FieldErrorDetail> errors
) {

    public static ErrorResponse of(
            String message,
            String errorCode,
            String path,
            List<FieldErrorDetail> errors
    ) {
        return new ErrorResponse(
                false,
                message,
                errorCode,
                path,
                Instant.now(),
                errors == null ? List.of() : List.copyOf(errors)
        );
    }

    public record FieldErrorDetail(
            String field,
            String message
    ) {
    }
}
