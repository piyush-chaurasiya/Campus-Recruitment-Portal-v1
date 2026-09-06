package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.controller.AdminController.CreateUserRequest;
import com.myanatomy.sandboxpro.controller.AdminController.UserResponse;
import com.myanatomy.sandboxpro.model.AcademicVerificationStatus;
import com.myanatomy.sandboxpro.model.JobStatus;
import com.myanatomy.sandboxpro.model.PasswordResetToken;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.AcademicVerificationRequestRepository;
import com.myanatomy.sandboxpro.repository.JobApplicationRepository;
import com.myanatomy.sandboxpro.repository.JobRepository;
import com.myanatomy.sandboxpro.repository.PasswordResetTokenRepository;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final AuditLogService auditLogService;
    private final StudentProfileRepository studentProfileRepository;
    private final AcademicVerificationRequestRepository academicVerificationRequestRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public AdminService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            AuditLogService auditLogService,
            StudentProfileRepository studentProfileRepository,
            AcademicVerificationRequestRepository academicVerificationRequestRepository,
            PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.auditLogService = auditLogService;
        this.studentProfileRepository = studentProfileRepository;
        this.academicVerificationRequestRepository = academicVerificationRequestRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public Map<String, Object> getDashboardMetrics() {
        List<User> users = userRepository.findAll();

        long total = users.size();
        long students = users.stream().filter(u -> u.getRole() == Role.STUDENT).count();
        long recruiters = users.stream().filter(u -> u.getRole() == Role.RECRUITER).count();
        long officers = users.stream().filter(u -> u.getRole() == Role.PLACEMENT_OFFICER).count();
        long admins = users.stream().filter(u -> u.getRole() == Role.ADMIN).count();
        long activeUsers = users.stream().filter(User::isEnabled).count();
        long disabledUsers = users.stream().filter(u -> !u.isEnabled()).count();

        long totalJobs = jobRepository.count();
        long pendingJobs = jobRepository.countByStatus(JobStatus.PENDING);
        long approvedJobs = jobRepository.countByStatus(JobStatus.APPROVED);
        long totalApplications = jobApplicationRepository.count();
        long pendingAcademicVerifications = academicVerificationRequestRepository
                .countByStatus(AcademicVerificationStatus.PENDING);

        return Map.ofEntries(
                Map.entry("totalUsers", total),
                Map.entry("students", students),
                Map.entry("recruiters", recruiters),
                Map.entry("placementOfficers", officers),
                Map.entry("admins", admins),
                Map.entry("activeUsers", activeUsers),
                Map.entry("disabledUsers", disabledUsers),
                Map.entry("totalJobs", totalJobs),
                Map.entry("pendingJobs", pendingJobs),
                Map.entry("approvedJobs", approvedJobs),
                Map.entry("totalApplications", totalApplications),
                Map.entry("pendingAcademicVerifications", pendingAcademicVerifications)
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request, String adminEmail) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required.");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must contain at least 6 characters.");
        }

        if (request.getRole() == null || request.getRole().isBlank()) {
            throw new IllegalArgumentException("Role is required.");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists.");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().trim().toUpperCase());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid role.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEnabled(true);

        User saved = userRepository.save(user);

        if (role == Role.STUDENT) {
            StudentProfile profile = new StudentProfile();
            profile.setUser(saved);
            studentProfileRepository.save(profile);
        }

        auditLogService.record(
                adminEmail,
                "USER_CREATED",
                "👤",
                String.format("Created user %s with role %s", saved.getEmail(), saved.getRole())
        );

        return UserResponse.from(saved);
    }

    @Transactional
    public UserResponse updateUserStatus(Long id, boolean enabled, String adminEmail) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (target.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin accounts cannot be modified.");
        }

        target.setEnabled(enabled);
        User saved = userRepository.save(target);

        auditLogService.record(
                adminEmail,
                "USER_STATUS_UPDATED",
                "⚙️",
                String.format("Set user %s status to %s", target.getEmail(), enabled ? "ACTIVE" : "DISABLED")
        );

        return UserResponse.from(saved);
    }

    @Transactional
    public void updatePassword(Long id, String newPassword, String adminEmail) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (target.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin passwords cannot be changed by another admin.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Password must contain at least 6 characters.");
        }

        target.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(target);

        auditLogService.record(
                adminEmail,
                "PASSWORD_UPDATED",
                "🔑",
                String.format("Updated password for user %s", target.getEmail())
        );
    }

    @Transactional
    public Map<String, String> generatePasswordResetToken(Long userId, String adminEmail) {
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (target.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin passwords cannot be reset by another admin.");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(target);
        resetToken.setToken(token);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(24));
        resetToken.setUsed(false);
        resetToken.setCreatedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        auditLogService.record(
                adminEmail,
                "PASSWORD_RESET_INITIATED",
                "🔑",
                String.format("Generated password reset link for user %s (%s)", target.getEmail(), target.getRole())
        );

        return Map.of(
                "message", "Password reset link generated successfully.",
                "resetToken", token,
                "resetLink", "/reset-password?token=" + token
        );
    }

    @Transactional
    public void deleteUser(Long id, String adminEmail) {
        User target = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (target.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin accounts cannot be deleted.");
        }

        userRepository.delete(target);

        auditLogService.record(
                adminEmail,
                "USER_DELETED",
                "🗑️",
                String.format("Deleted user account %s (%s)", target.getEmail(), target.getRole())
        );
    }
}
