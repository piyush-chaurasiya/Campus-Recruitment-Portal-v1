package com.myanatomy.sandboxpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicVerificationRejectRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(max = 500, message = "Rejection reason cannot exceed 500 characters")
    private String reason;
}
