package com.myanatomy.sandboxpro.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicVerificationRequestDto {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double tenthPercentage;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double tenthMathPercentage;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double twelfthPercentage;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double twelfthMathPercentage;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double cgpa;

    @NotNull
    @Min(0)
    private Integer backlogs;
}
