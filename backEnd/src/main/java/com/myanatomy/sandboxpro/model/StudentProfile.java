package com.myanatomy.sandboxpro.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 15)
    private String phone;

    private LocalDate dateOfBirth;

    @Column(length = 30)
    private String gender;

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(length = 20)
    private String branch;

    @Column(length = 100)
    private String course;

    private Integer passingYear;

    @Column(length = 1000)
    private String skills;

    @Column(length = 500)
    private String githubUrl;

    @Column(length = 500)
    private String linkedinUrl;

    @Column(nullable = false)
    private Double tenthPercentage = 0.0;

    @Column(nullable = false)
    private Double tenthMathPercentage = 0.0;

    @Column(nullable = false)
    private Double twelfthPercentage = 0.0;

    @Column(nullable = false)
    private Double twelfthMathPercentage = 0.0;

    @Column(nullable = false)
    private Double cgpa = 0.0;

    @Column(nullable = false)
    private Integer backlogs = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AcademicStatus academicStatus = AcademicStatus.PENDING;

    @Lob
    @Column(name = "resume_data", columnDefinition = "LONGBLOB")
    private byte[] resumeData;

    @Column(name = "resume_name")
    private String resumeName;

    @Column(name = "resume_content_type")
    private String resumeContentType;

    @Column(name = "resume_path")
    private String resumePath;
}
