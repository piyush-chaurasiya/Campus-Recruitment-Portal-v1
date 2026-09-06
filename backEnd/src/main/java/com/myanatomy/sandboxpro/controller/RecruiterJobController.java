package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.CreateJobRequest;
import com.myanatomy.sandboxpro.dto.JobResponse;
import com.myanatomy.sandboxpro.service.JobService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class RecruiterJobController {

    private final JobService jobService;

    public RecruiterJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> getMyJobs(Authentication authentication) {
        return jobService.getJobsByCreator(authentication.getName());
    }

    @PostMapping
    public JobResponse createJob(
            @RequestBody CreateJobRequest request,
            Authentication authentication
    ) {
        return jobService.createJob(
                request,
                authentication.getName()
        );
    }

    @PutMapping("/{id}/close")
    public JobResponse closeJob(@PathVariable Long id) {
        return jobService.closeJob(id);
    }
}
