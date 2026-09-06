package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;
    private String action;
    private String actor;
    private String icon;
    private String details;
    private LocalDateTime timestamp;

    public static AuditLogResponse from(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getAction(),
                log.getActor(),
                log.getIcon() != null ? log.getIcon() : "📋",
                log.getDetails(),
                log.getTimestamp()
        );
    }
}
