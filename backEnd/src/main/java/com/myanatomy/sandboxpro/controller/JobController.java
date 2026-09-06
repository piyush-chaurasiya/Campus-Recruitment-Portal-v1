package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.JobResponse;
import com.myanatomy.sandboxpro.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // STUDENT
    @GetMapping("/published")
    public List<JobResponse> getPublishedJobs(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return jobService.getPublishedJobs(email);
    }

    // STUDENT
    @GetMapping("/{id}")
    public JobResponse getJob(@PathVariable Long id, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return jobService.getJob(id, email);
    }

    // ADMIN
    @GetMapping("/admin/all")
    public List<JobResponse> getAllJobs() {
        return jobService.getAllJobs();
    }

    // ADMIN
    @PutMapping("/admin/{id}/approve")
    public JobResponse approveJob(@PathVariable Long id) {
        return jobService.approveJob(id);
    }

    // ADMIN
    @PutMapping("/admin/{id}/reject")
    public JobResponse rejectJob(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        return jobService.rejectJob(id, reason);
    }
}
