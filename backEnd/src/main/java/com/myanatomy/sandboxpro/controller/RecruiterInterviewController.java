package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.CreateInterviewRequest;
import com.myanatomy.sandboxpro.dto.InterviewResponse;
import com.myanatomy.sandboxpro.dto.UpdateInterviewStatusRequest;
import com.myanatomy.sandboxpro.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/interviews")
public class RecruiterInterviewController {

    private final InterviewService interviewService;

    public RecruiterInterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<InterviewResponse> getMyInterviews(Authentication authentication) {
        return interviewService.getInterviewsForRecruiter(authentication.getName());
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @Valid @RequestBody CreateInterviewRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.scheduleInterview(authentication.getName(), request)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInterviewStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                interviewService.updateInterviewStatus(id, authentication.getName(), request)
        );
    }
}
