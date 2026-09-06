package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.JobResponse;
import com.myanatomy.sandboxpro.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/jobs")
public class StudentJobController {

    private final JobService jobService;

    public StudentJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<JobResponse> getJobs(Authentication authentication) {
        return jobService.getPublishedJobs(authentication.getName());
    }

    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id, Authentication authentication) {
        return jobService.getJob(id, authentication.getName());
    }
}
