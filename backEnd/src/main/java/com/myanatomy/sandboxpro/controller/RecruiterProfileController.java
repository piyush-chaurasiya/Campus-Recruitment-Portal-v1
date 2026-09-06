package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.RecruiterProfileResponse;
import com.myanatomy.sandboxpro.dto.UpdateRecruiterProfileRequest;
import com.myanatomy.sandboxpro.service.RecruiterProfileService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter/profile")
public class RecruiterProfileController {

    private final RecruiterProfileService profileService;

    public RecruiterProfileController(
            RecruiterProfileService profileService
    ) {
        this.profileService = profileService;
    }

    @GetMapping
    public RecruiterProfileResponse getProfile(
            Authentication authentication
    ) {
        return profileService.getProfile(
                authentication.getName()
        );
    }

    @PutMapping
    public RecruiterProfileResponse updateProfile(
            @RequestBody UpdateRecruiterProfileRequest request,
            Authentication authentication
    ) {
        return profileService.updateProfile(
                authentication.getName(),
                request
        );
    }
}
