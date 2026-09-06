package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.AcademicVerificationRejectRequest;
import com.myanatomy.sandboxpro.dto.AdminAcademicVerificationResponse;
import com.myanatomy.sandboxpro.service.AdminAcademicVerificationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/academic")
public class AdminAcademicVerificationController {

    private final AdminAcademicVerificationService verificationService;

    public AdminAcademicVerificationController(
            AdminAcademicVerificationService verificationService) {

        this.verificationService = verificationService;
    }

    @GetMapping("/verifications")
    public ResponseEntity<List<AdminAcademicVerificationResponse>>
    getPendingVerifications() {

        return ResponseEntity.ok(
                verificationService.getPendingRequests()
        );
    }

    @GetMapping("/verifications/{requestId}")
    public ResponseEntity<AdminAcademicVerificationResponse>
    getVerificationById(
            @PathVariable Long requestId) {

        return ResponseEntity.ok(
                verificationService.getRequestById(requestId)
        );
    }

    @PutMapping("/verifications/{requestId}/approve")
    public ResponseEntity<AdminAcademicVerificationResponse>
    approveVerification(
            @PathVariable Long requestId,
            Authentication authentication) {

        return ResponseEntity.ok(
                verificationService.approveRequest(
                        requestId,
                        authentication.getName()
                )
        );
    }
    @PutMapping("/verifications/{requestId}/reject")
        public ResponseEntity<AdminAcademicVerificationResponse>
        rejectVerification(
                @PathVariable Long requestId,
                @Valid @RequestBody AcademicVerificationRejectRequest request,
                Authentication authentication) {

        return ResponseEntity.ok(
                verificationService.rejectRequest(
                        requestId,
                        authentication.getName(),
                        request.getReason()
                )
        );
    }
}