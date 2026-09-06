package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.InterviewResponse;
import com.myanatomy.sandboxpro.service.InterviewService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student/interviews")
public class StudentInterviewController {

    private final InterviewService interviewService;

    public StudentInterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<InterviewResponse> getMyInterviews(Authentication authentication) {
        return interviewService.getInterviewsForStudent(authentication.getName());
    }
}
