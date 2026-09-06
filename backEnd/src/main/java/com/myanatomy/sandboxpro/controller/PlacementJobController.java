package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.CreateJobRequest;
import com.myanatomy.sandboxpro.dto.JobResponse;
import com.myanatomy.sandboxpro.service.JobService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement/jobs")
public class PlacementJobController {

    private final JobService jobService;

    public PlacementJobController(JobService jobService) {
        this.jobService = jobService;
    }

    // PLACEMENT OFFICER - list all placement drives (jobs), any status
    @GetMapping
    public List<JobResponse> getAllJobs() {
        return jobService.getAllJobs();
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

    @PutMapping("/{id}/approve")
    public JobResponse approveJob(
            @PathVariable Long id
    ) {

        return jobService.approveJob(id);
    }

    // PLACEMENT OFFICER - reject a pending drive
    @PutMapping("/{id}/reject")
    public JobResponse rejectJob(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {

        return jobService.rejectJob(id, reason);
    }
}