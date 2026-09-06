package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.InterviewMode;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterviewRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledTime;

    private Integer durationMinutes = 45;

    private InterviewMode mode = InterviewMode.ONLINE;

    private String meetingLink;

    private String location;

    private String roundName;

    private String notes;
}
