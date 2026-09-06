package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.JobType;
import com.myanatomy.sandboxpro.model.WorkMode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    private String title;
    private String companyName;
    private String description;
    private String location;

    private JobType jobType;
    private WorkMode workMode;

    private Boolean paid;
    private Double stipendOrSalary;

    private Double minimumCgpa;
    private Integer maximumBacklogs;

    private Double minimumTenthPercentage;
    private Double minimumTwelfthPercentage;

    private String eligibleBranches;

    private LocalDate applicationDeadline;
    private LocalDate joiningDate;
}
