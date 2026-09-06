package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.InterviewStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateInterviewStatusRequest {

    @NotNull(message = "Status is required")
    private InterviewStatus status;

    private String notes;
}
