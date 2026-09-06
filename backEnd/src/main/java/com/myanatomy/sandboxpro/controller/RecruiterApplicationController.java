package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.PlacementApplicationResponse;
import com.myanatomy.sandboxpro.dto.UpdateApplicationStatusRequest;
import com.myanatomy.sandboxpro.service.JobApplicationService;
import com.myanatomy.sandboxpro.service.StudentResumeService;
import com.myanatomy.sandboxpro.service.StudentResumeService.ResumePayload;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/applications")
public class RecruiterApplicationController {

    private final JobApplicationService applicationService;
    private final StudentResumeService resumeService;

    public RecruiterApplicationController(
            JobApplicationService applicationService,
            StudentResumeService resumeService
    ) {
        this.applicationService = applicationService;
        this.resumeService = resumeService;
    }

    @GetMapping
    public List<PlacementApplicationResponse> getApplications(
            @RequestParam(required = false) Long jobId,
            Authentication authentication
    ) {

        return applicationService.getApplicationsForRecruiter(
                authentication.getName(),
                jobId
        );
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> getApplicantResume(
            @PathVariable Long id,
            Authentication authentication
    ) {
        ResumePayload payload = resumeService.getResumeForRecruiter(id, authentication.getName());
        if (payload == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(payload.contentType()));
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(payload.filename())
                        .build()
        );

        return new ResponseEntity<>(payload.data(), headers, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public PlacementApplicationResponse updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateApplicationStatusRequest request,
            Authentication authentication
    ) {

        return applicationService.updateStatusAsRecruiter(
                authentication.getName(),
                id,
                request.getStatus(),
                request.getRemarks()
        );
    }
}
