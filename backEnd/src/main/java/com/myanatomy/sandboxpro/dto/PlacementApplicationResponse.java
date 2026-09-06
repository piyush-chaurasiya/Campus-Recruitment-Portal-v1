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
public class PlacementApplicationResponse {

    private Long id;

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String branch;
    private Double cgpa;
    private Integer backlogs;
    private Boolean hasResume;

    private ApplicationStatus status;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    private String remarks;

    public static PlacementApplicationResponse from(
            JobApplication application
    ) {

        PlacementApplicationResponse response =
                new PlacementApplicationResponse();

        response.setId(application.getId());

        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setCompanyName(application.getJob().getCompanyName());

        var student = application.getStudent();

        response.setStudentId(student.getId());
        response.setStudentName(student.getUser().getName());
        response.setStudentEmail(student.getUser().getEmail());
        response.setBranch(student.getBranch());
        response.setCgpa(student.getCgpa());
        response.setBacklogs(student.getBacklogs());
        response.setHasResume(student.getResumeName() != null);

        response.setStatus(application.getStatus());

        response.setAppliedAt(application.getAppliedAt());
        response.setUpdatedAt(application.getUpdatedAt());

        response.setRemarks(application.getRemarks());

        return response;
    }
}
