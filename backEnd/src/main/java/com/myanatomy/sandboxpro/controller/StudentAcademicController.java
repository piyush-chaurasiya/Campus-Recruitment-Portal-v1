package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.AcademicVerificationRequestDto;
import com.myanatomy.sandboxpro.dto.AcademicVerificationResponse;
import com.myanatomy.sandboxpro.service.AcademicVerificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/academic")
public class StudentAcademicController {

    private final AcademicVerificationService verificationService;

    public StudentAcademicController(
            AcademicVerificationService verificationService) {

        this.verificationService = verificationService;
    }

    @PostMapping("/verification")
    public ResponseEntity<AcademicVerificationResponse> submitVerification(
            Authentication authentication,
            @Valid @RequestBody AcademicVerificationRequestDto request) {

        AcademicVerificationResponse response =
                verificationService.submitRequest(
                        authentication.getName(),
                        request
                );

        if (response.getMessage() != null) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/verification")
    public ResponseEntity<AcademicVerificationResponse> getVerificationStatus(
            Authentication authentication) {

        return verificationService
                .getLatestRequest(authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}