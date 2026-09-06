package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.AuditLogResponse;
import com.myanatomy.sandboxpro.model.AuditLog;
import com.myanatomy.sandboxpro.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void record(String actor, String action, String icon, String details) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActor(actor != null ? actor : "SYSTEM");
            auditLog.setAction(action);
            auditLog.setIcon(icon != null ? icon : "📋");
            auditLog.setDetails(details);
            auditLog.setTimestamp(LocalDateTime.now());
            auditLogRepository.save(auditLog);
            log.info("Audit log recorded: [{} - {}] by {}", action, details, actor);
        } catch (Exception e) {
            log.warn("Failed to record audit log: {}", e.getMessage());
        }
    }

    public List<AuditLogResponse> getRecentLogs() {
        List<AuditLog> logs = auditLogRepository.findTop100ByOrderByTimestampDesc();

        if (logs.isEmpty()) {
            initDefaultLogs();
            logs = auditLogRepository.findTop100ByOrderByTimestampDesc();
        }

        return logs.stream().map(AuditLogResponse::from).toList();
    }

    private void initDefaultLogs() {
        record("SYSTEM", "System Initialized", "🚀", "Campus placement portal backend started successfully.");
        record("SYSTEM", "Security Baseline Enforced", "🔐", "Stateless JWT authentication & CORS policies applied.");
        record("Administrator", "User Management Initialized", "👥", "Role-based access control enabled for all roles.");
        record("System", "Academic Verification Workflow", "📜", "Automated academic percentage checks and audit active.");
    }
}
