package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ApplicationResponse;
import com.myanatomy.sandboxpro.service.JobApplicationService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/applications")
public class StudentApplicationController {

    private final JobApplicationService applicationService;

    public StudentApplicationController(
            JobApplicationService applicationService
    ) {
        this.applicationService =
                applicationService;
    }

    @PostMapping("/jobs/{jobId}")
    public ApplicationResponse apply(
            @PathVariable Long jobId,
            Authentication authentication
    ) {

        return applicationService.apply(
                jobId,
                authentication.getName()
        );
    }

    @GetMapping
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication
    ) {

        return applicationService.getMyApplications(
                authentication.getName()
        );
    }

    @PutMapping("/{id}/withdraw")
    public ApplicationResponse withdrawApplication(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return applicationService.withdraw(
                id,
                authentication.getName()
        );
    }
}