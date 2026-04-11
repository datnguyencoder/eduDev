package com.datdev.edudev.major.dto;

import jakarta.validation.constraints.NotNull;

public record WishlistRequest(
        @NotNull Long majorId,
        Integer priority
) {
}
