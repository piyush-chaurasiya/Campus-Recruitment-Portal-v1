package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.AcademicStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileResponse {

    private String name;
    private String email;

    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String branch;
    private String course;
    private Integer passingYear;

    private String skills;
    private String githubUrl;
    private String linkedinUrl;

    private Double tenthPercentage;
    private Double tenthMathPercentage;
    private Double twelfthPercentage;
    private Double twelfthMathPercentage;
    private Double cgpa;
    private Integer backlogs;

    private AcademicStatus academicStatus;
}
