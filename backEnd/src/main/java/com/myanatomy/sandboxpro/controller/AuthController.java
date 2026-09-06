package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.ChangePasswordRequest;
import com.myanatomy.sandboxpro.dto.ForgotPasswordRequest;
import com.myanatomy.sandboxpro.dto.LoginRequest;
import com.myanatomy.sandboxpro.dto.LoginResponse;
import com.myanatomy.sandboxpro.dto.ResetPasswordRequest;
import com.myanatomy.sandboxpro.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated."));
        }

        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
