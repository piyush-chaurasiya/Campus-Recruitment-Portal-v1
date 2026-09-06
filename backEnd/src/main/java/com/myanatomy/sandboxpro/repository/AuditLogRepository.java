package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findTop100ByOrderByTimestampDesc();
}
