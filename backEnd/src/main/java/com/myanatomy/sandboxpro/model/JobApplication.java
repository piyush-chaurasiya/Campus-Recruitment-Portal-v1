package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "job_id",
                                "student_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "job_id")
    private Job job;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private StudentProfile student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;

    @Column(length = 1000)
    private String remarks;

    @PrePersist
    public void prePersist() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = ApplicationStatus.APPLIED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
