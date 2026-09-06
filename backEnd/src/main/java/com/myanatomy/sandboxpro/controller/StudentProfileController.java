package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.StudentProfileResponse;
import com.myanatomy.sandboxpro.dto.UpdateStudentProfileRequest;
import com.myanatomy.sandboxpro.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(
            StudentProfileService profileService) {

        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(
            Authentication authentication) {

        return ResponseEntity.ok(
                profileService.getProfile(
                        authentication.getName()
                )
        );
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateStudentProfileRequest request) {

        return ResponseEntity.ok(
                profileService.updateProfile(
                        authentication.getName(),
                        request
                )
        );
    }
}