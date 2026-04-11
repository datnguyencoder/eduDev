package com.datdev.edudev.common.response;

import java.time.Instant;
import java.util.List;

public record PageResponse<T>(
        boolean success,
        String message,
        List<T> data,
        Meta meta,
        Instant timestamp
) {

    public static <T> PageResponse<T> success(String message, List<T> data, Meta meta) {
        return new PageResponse<>(true, message, data, meta, Instant.now());
    }

    public record Meta(
            int page,
            int size,
            long totalElements,
            int totalPages
    ) {
    }
}
