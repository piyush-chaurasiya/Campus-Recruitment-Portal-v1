package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.ApplicationStatus;
import com.myanatomy.sandboxpro.model.JobApplication;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    private String remarks;

    public static ApplicationResponse from(
            JobApplication application
    ) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        response.setJobId(
                application.getJob().getId());

        response.setJobTitle(
                application.getJob().getTitle());

        response.setCompanyName(
                application.getJob().getCompanyName());

        response.setStatus(
                application.getStatus());

        response.setAppliedAt(
                application.getAppliedAt());

        response.setUpdatedAt(
                application.getUpdatedAt());

        response.setRemarks(
                application.getRemarks());

        return response;
    }
}
