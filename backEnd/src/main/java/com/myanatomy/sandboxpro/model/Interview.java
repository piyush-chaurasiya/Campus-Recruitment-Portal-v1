package com.myanatomy.sandboxpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    private Integer durationMinutes = 45;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterviewMode mode = InterviewMode.ONLINE;

    @Column(length = 500)
    private String meetingLink;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String roundName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(length = 1000)
    private String notes;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = InterviewStatus.SCHEDULED;
        }
        if (mode == null) {
            mode = InterviewMode.ONLINE;
        }
        if (durationMinutes == null) {
            durationMinutes = 45;
        }
    }
}
