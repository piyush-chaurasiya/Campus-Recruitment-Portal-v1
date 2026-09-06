package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.JobStatus;
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
public class JobResponse {

    private Long id;
    private String title;
    private String companyName;
    private String description;
    private String location;

    private JobType jobType;
    private WorkMode workMode;
    private JobStatus status;

    private Boolean paid;
    private Double stipendOrSalary;

    private Double minimumCgpa;
    private Integer maximumBacklogs;
    private Double minimumTenthPercentage;
    private Double minimumTwelfthPercentage;

    private String eligibleBranches;

    private LocalDate applicationDeadline;
    private LocalDate joiningDate;

    private Boolean eligible;
    private String eligibilityReason;

    public static JobResponse from(Job job) {

        JobResponse response = new JobResponse();

        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompanyName(job.getCompanyName());
        response.setDescription(job.getDescription());
        response.setLocation(job.getLocation());

        response.setJobType(job.getJobType());
        response.setWorkMode(job.getWorkMode());
        response.setStatus(job.getStatus());

        response.setPaid(job.getPaid());
        response.setStipendOrSalary(job.getStipendOrSalary());

        response.setMinimumCgpa(job.getMinimumCgpa());
        response.setMaximumBacklogs(job.getMaximumBacklogs());
        response.setMinimumTenthPercentage(job.getMinimumTenthPercentage());
        response.setMinimumTwelfthPercentage(job.getMinimumTwelfthPercentage());

        response.setEligibleBranches(job.getEligibleBranches());
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setJoiningDate(job.getJoiningDate());

        return response;
    }
}
