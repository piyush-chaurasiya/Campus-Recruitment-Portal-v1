package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.CreateInterviewRequest;
import com.myanatomy.sandboxpro.dto.InterviewResponse;
import com.myanatomy.sandboxpro.dto.UpdateInterviewStatusRequest;
import com.myanatomy.sandboxpro.model.ApplicationStatus;
import com.myanatomy.sandboxpro.model.Interview;
import com.myanatomy.sandboxpro.model.JobApplication;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.repository.InterviewRepository;
import com.myanatomy.sandboxpro.repository.JobApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            JobApplicationRepository applicationRepository,
            NotificationService notificationService
    ) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public InterviewResponse scheduleInterview(String recruiterEmail, CreateInterviewRequest request) {
        JobApplication application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found: " + request.getApplicationId()));

        if (!recruiterEmail.equals(application.getJob().getCreatedBy())) {
            throw new AccessDeniedException("You can only schedule interviews for candidates who applied to your jobs.");
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setScheduledTime(request.getScheduledTime());
        interview.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 45);
        interview.setMode(request.getMode() != null ? request.getMode() : com.myanatomy.sandboxpro.model.InterviewMode.ONLINE);
        interview.setMeetingLink(request.getMeetingLink());
        interview.setLocation(request.getLocation());
        interview.setRoundName(request.getRoundName() != null && !request.getRoundName().isBlank() ? request.getRoundName() : "Interview Round");
        interview.setNotes(request.getNotes());

        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        Interview saved = interviewRepository.save(interview);

        // Notify student
        String studentEmail = application.getStudent().getUser().getEmail();
        String formattedTime = request.getScheduledTime().format(FORMATTER);
        String message = String.format(
                "Your interview for '%s' at %s has been scheduled on %s (%s).",
                application.getJob().getTitle(),
                application.getJob().getCompanyName(),
                formattedTime,
                interview.getMode()
        );

        notificationService.notifyUser(
                studentEmail,
                Role.STUDENT,
                "Interview Scheduled",
                message
        );

        log.info("Scheduled interview {} for candidate {} by recruiter {}", saved.getId(), studentEmail, recruiterEmail);
        return InterviewResponse.from(saved);
    }

    public List<InterviewResponse> getInterviewsForRecruiter(String recruiterEmail) {
        return interviewRepository.findByApplication_Job_CreatedByOrderByScheduledTimeDesc(recruiterEmail)
                .stream()
                .map(InterviewResponse::from)
                .toList();
    }

    public List<InterviewResponse> getInterviewsForStudent(String studentEmail) {
        return interviewRepository.findByApplication_Student_User_EmailOrderByScheduledTimeDesc(studentEmail)
                .stream()
                .map(InterviewResponse::from)
                .toList();
    }

    @Transactional
    public InterviewResponse updateInterviewStatus(Long interviewId, String recruiterEmail, UpdateInterviewStatusRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found: " + interviewId));

        if (!recruiterEmail.equals(interview.getApplication().getJob().getCreatedBy())) {
            throw new AccessDeniedException("You can only update interviews for your own job postings.");
        }

        interview.setStatus(request.getStatus());
        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            interview.setNotes(request.getNotes());
        }

        Interview saved = interviewRepository.save(interview);

        String studentEmail = interview.getApplication().getStudent().getUser().getEmail();
        notificationService.notifyUser(
                studentEmail,
                Role.STUDENT,
                "Interview " + request.getStatus(),
                String.format("Your interview for '%s' at %s is marked as %s.",
                        interview.getApplication().getJob().getTitle(),
                        interview.getApplication().getJob().getCompanyName(),
                        request.getStatus())
        );

        log.info("Updated interview {} status to {} by {}", interviewId, request.getStatus(), recruiterEmail);
        return InterviewResponse.from(saved);
    }
}
