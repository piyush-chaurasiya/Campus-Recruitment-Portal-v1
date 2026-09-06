package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.ChangePasswordRequest;
import com.myanatomy.sandboxpro.dto.ForgotPasswordRequest;
import com.myanatomy.sandboxpro.dto.LoginRequest;
import com.myanatomy.sandboxpro.dto.LoginResponse;
import com.myanatomy.sandboxpro.dto.ResetPasswordRequest;
import com.myanatomy.sandboxpro.model.PasswordResetToken;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.PasswordResetTokenRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import com.myanatomy.sandboxpro.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogService auditLogService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditLogService auditLogService,
            PasswordResetTokenRepository passwordResetTokenRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditLogService = auditLogService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Email and password are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Login attempt failed: user with email {} not found", email);
                    return new RuntimeException("Invalid credentials");
                });

        if (!user.isEnabled()) {
            log.warn("Login attempt failed: account {} is disabled", email);
            throw new RuntimeException("Account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login attempt failed: invalid password for user {}", email);
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        log.info("User {} logged in successfully as {}", email, user.getRole());

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        if (email == null) {
            throw new RuntimeException("User not authenticated.");
        }

        if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
            throw new IllegalArgumentException("Current password is required.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters.");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        auditLogService.record(
                email,
                "PASSWORD_CHANGED",
                "🔑",
                String.format("User %s (%s) changed their account password.", email, user.getRole())
        );

        log.info("Password successfully changed for user {}", email);
    }

    @Transactional
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !user.isEnabled()) {
            // Return safe generic message to prevent email enumeration
            return Map.of(
                    "message", "If an account with this email exists, password reset instructions have been generated."
            );
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        auditLogService.record(
                email,
                "FORGOT_PASSWORD_REQUESTED",
                "🔑",
                String.format("Password reset token generated for %s", email)
        );

        return Map.of(
                "message", "If an account with this email exists, password reset instructions have been generated.",
                "resetToken", token,
                "resetLink", "/reset-password?token=" + token
        );
    }

    @Transactional
    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndUsedFalse(request.getToken().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or already used password reset link."));

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This password reset link has expired. Please request a new one.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        if (request.getConfirmPassword() != null && !request.getConfirmPassword().isBlank() &&
                !request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        auditLogService.record(
                user.getEmail(),
                "PASSWORD_RESET_COMPLETED",
                "🔑",
                String.format("Password successfully reset via token for user %s", user.getEmail())
        );

        return Map.of("message", "Password has been reset successfully. You can now login with your new password.");
    }
}
