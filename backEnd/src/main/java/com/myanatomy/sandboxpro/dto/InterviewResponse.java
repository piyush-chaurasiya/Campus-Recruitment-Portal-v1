package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.Interview;
import com.myanatomy.sandboxpro.model.InterviewMode;
import com.myanatomy.sandboxpro.model.InterviewStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private Long id;
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String companyName;

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentBranch;

    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private InterviewMode mode;
    private String meetingLink;
    private String location;
    private String roundName;
    private InterviewStatus status;
    private String notes;
    private LocalDateTime createdAt;

    public static InterviewResponse from(Interview interview) {
        InterviewResponse response = new InterviewResponse();
        response.setId(interview.getId());

        var app = interview.getApplication();
        if (app != null) {
            response.setApplicationId(app.getId());
            if (app.getJob() != null) {
                response.setJobId(app.getJob().getId());
                response.setJobTitle(app.getJob().getTitle());
                response.setCompanyName(app.getJob().getCompanyName());
            }
            if (app.getStudent() != null) {
                response.setStudentId(app.getStudent().getId());
                response.setStudentBranch(app.getStudent().getBranch());
                if (app.getStudent().getUser() != null) {
                    response.setStudentName(app.getStudent().getUser().getName());
                    response.setStudentEmail(app.getStudent().getUser().getEmail());
                }
            }
        }

        response.setScheduledTime(interview.getScheduledTime());
        response.setDurationMinutes(interview.getDurationMinutes());
        response.setMode(interview.getMode());
        response.setMeetingLink(interview.getMeetingLink());
        response.setLocation(interview.getLocation());
        response.setRoundName(interview.getRoundName());
        response.setStatus(interview.getStatus());
        response.setNotes(interview.getNotes());
        response.setCreatedAt(interview.getCreatedAt());

        return response;
    }
}
