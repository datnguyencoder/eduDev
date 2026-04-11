package com.datdev.edudev.system.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ValidationProbeRequest(
        @NotBlank(message = "Email must not be blank")
        @Email(message = "Email format is invalid")
        String email
) {
}
