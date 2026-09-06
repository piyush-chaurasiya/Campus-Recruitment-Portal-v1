package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.AcademicVerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicVerificationResponse {

    private Long requestId;

    private Double tenthPercentage;
    private Double tenthMathPercentage;

    private Double twelfthPercentage;
    private Double twelfthMathPercentage;

    private Double cgpa;
    private Integer backlogs;

    private AcademicVerificationStatus status;

    private String rejectionReason;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;

    private String message;
}
