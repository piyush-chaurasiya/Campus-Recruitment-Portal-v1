package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    @Column(length = 5000)
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    private WorkMode workMode;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private Boolean paid;

    private Double stipendOrSalary;

    private Double minimumCgpa;

    private Integer maximumBacklogs;

    private Double minimumTenthPercentage;

    private Double minimumTwelfthPercentage;

    private String eligibleBranches;

    private LocalDate applicationDeadline;

    private LocalDate joiningDate;

    private LocalDateTime createdAt;

    private String createdBy;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();

        if (status == null) {
            status = JobStatus.PENDING;
        }
    }
}
