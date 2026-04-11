package com.datdev.edudev.major.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReorderWishlistRequest(
        @NotEmpty List<Long> majorIds
) {
}
