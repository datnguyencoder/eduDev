package com.datdev.edudev.major.dto;

public record WishlistMajorResponse(
        Long id,
        Long majorId,
        String majorCode,
        String majorName,
        Integer priority
) {
}
