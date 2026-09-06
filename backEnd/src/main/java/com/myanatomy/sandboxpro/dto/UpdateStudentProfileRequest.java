package com.myanatomy.sandboxpro.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStudentProfileRequest {

    @Size(max = 15)
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 30)
    private String gender;

    @Size(max = 500)
    private String address;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String state;

    @Size(max = 10)
    private String pincode;

    @Size(max = 100)
    private String branch;

    @Size(max = 100)
    private String course;

    private Integer passingYear;

    @Size(max = 1000)
    private String skills;

    @Size(max = 500)
    private String githubUrl;

    @Size(max = 500)
    private String linkedinUrl;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double tenthPercentage;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double tenthMathPercentage;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double twelfthPercentage;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private Double twelfthMathPercentage;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double cgpa;

    @Min(0)
    private Integer backlogs;
}
