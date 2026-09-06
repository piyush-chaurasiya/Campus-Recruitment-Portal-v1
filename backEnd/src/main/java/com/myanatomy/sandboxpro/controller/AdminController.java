package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.AuditLogResponse;
import com.myanatomy.sandboxpro.service.AdminService;
import com.myanatomy.sandboxpro.service.AuditLogService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;

    public AdminController(AdminService adminService, AuditLogService auditLogService) {
        this.adminService = adminService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "ADMIN";
        return ResponseEntity.ok(adminService.createUser(request, actor));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "ADMIN";
        return ResponseEntity.ok(adminService.updateUserStatus(id, enabled, actor));
    }

    @PutMapping("/users/{id}/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @PathVariable Long id,
            @RequestBody PasswordRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "ADMIN";
        adminService.updatePassword(id, request.getPassword(), actor);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<Map<String, String>> resetUserPassword(
            @PathVariable Long id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "ADMIN";
        return ResponseEntity.ok(adminService.generatePasswordResetToken(id, actor));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "ADMIN";
        adminService.deleteUser(id, actor);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogResponse>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getRecentLogs());
    }

    // ================= REQUEST DTOs =================

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateUserRequest {
        private String name;
        private String email;
        private String password;
        private String role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PasswordRequest {
        private String password;
    }

    // ================= RESPONSE DTO =================

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private boolean enabled;

        public static UserResponse from(com.myanatomy.sandboxpro.model.User user) {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().name());
            response.setEnabled(user.isEnabled());
            return response;
        }
    }
}
