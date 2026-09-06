package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "academic_verification_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicVerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(nullable = false)
    private Double tenthPercentage;

    @Column(nullable = false)
    private Double tenthMathPercentage;

    @Column(nullable = false)
    private Double twelfthPercentage;

    @Column(nullable = false)
    private Double twelfthMathPercentage;

    @Column(nullable = false)
    private Double cgpa;

    @Column(nullable = false)
    private Integer backlogs;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AcademicVerificationStatus status =
            AcademicVerificationStatus.PENDING;

    @Column(length = 1000)
    private String rejectionReason;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
}
