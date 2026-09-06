package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(nullable = false, length = 255)
    private String actor;

    @Column(length = 20)
    private String icon = "📋";

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (icon == null) {
            icon = "📋";
        }
    }
}
