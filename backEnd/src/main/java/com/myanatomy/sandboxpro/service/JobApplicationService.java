package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.ApplicationResponse;
import com.myanatomy.sandboxpro.dto.PlacementApplicationResponse;
import com.myanatomy.sandboxpro.model.ApplicationStatus;
import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.JobApplication;
import com.myanatomy.sandboxpro.model.JobStatus;
import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.repository.JobApplicationRepository;
import com.myanatomy.sandboxpro.repository.JobRepository;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;

    public JobApplicationService(
            JobApplicationRepository applicationRepository,
            JobRepository jobRepository,
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            EligibilityService eligibilityService,
            NotificationService notificationService
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.studentProfileRepository =
                studentProfileRepository;
        this.userRepository = userRepository;
        this.eligibilityService = eligibilityService;
        this.notificationService = notificationService;
    }

    // =========================
    // APPLY FOR JOB
    // =========================

    public ApplicationResponse apply(
            Long jobId,
            String email
    ) {

        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );

        StudentProfile profile =
                studentProfileRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."
                                )
                        );

        Job job = jobRepository
                .findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found."
                        )
                );

        if (job.getStatus() != JobStatus.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This opportunity is not available."
            );
        }

        if (job.getApplicationDeadline() != null && LocalDate.now().isAfter(job.getApplicationDeadline())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The application deadline for this opportunity has passed."
            );
        }

        if (applicationRepository
                .existsByJobIdAndStudentId(
                        jobId,
                        profile.getId()
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already applied for this opportunity."
            );
        }

        EligibilityService.EligibilityResult eligibility =
                eligibilityService.check(
                        job,
                        profile
                );

        if (!eligibility.eligible()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You are not eligible. " + eligibility.reason()
            );
        }

        JobApplication application =
                new JobApplication();

        application.setJob(job);
        application.setStudent(profile);
        application.setStatus(
                ApplicationStatus.APPLIED
        );

        JobApplication saved =
                applicationRepository.save(
                        application
                );

        notificationService.notifyRole(
                Role.PLACEMENT_OFFICER,
                "New Application Received",
                profile.getUser().getName()
                        + " applied for "
                        + job.getTitle()
                        + " at "
                        + job.getCompanyName()
                        + "."
        );

        notificationService.notifyUser(
                job.getCreatedBy(),
                Role.RECRUITER,
                "New Application Received",
                profile.getUser().getName()
                        + " applied for your job posting: "
                        + job.getTitle()
                        + "."
        );

        notificationService.notifyUser(
                email,
                Role.STUDENT,
                "Application Submitted",
                "You successfully applied for '" + job.getTitle() + "' at " + job.getCompanyName() + "."
        );

        return ApplicationResponse.from(saved);
    }

    // =========================
    // MY APPLICATIONS
    // =========================

    public List<ApplicationResponse> getMyApplications(
            String email
    ) {

        var user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );

        StudentProfile profile =
                studentProfileRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found."
                                )
                        );

        return applicationRepository
                .findByStudentIdOrderByAppliedAtDesc(
                        profile.getId()
                )
                .stream()
                .map(ApplicationResponse::from)
                .toList();
    }

    // =========================
    // STUDENT - WITHDRAW APPLICATION
    // =========================

    @Transactional
    public ApplicationResponse withdraw(Long applicationId, String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found."));

        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));

        if (!application.getStudent().getId().equals(profile.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only withdraw your own applications.");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot withdraw an application after being selected.");
        }

        if (application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This application is already withdrawn.");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        JobApplication saved = applicationRepository.save(application);

        if (saved.getJob().getCreatedBy() != null) {
            notificationService.notifyUser(
                    saved.getJob().getCreatedBy(),
                    Role.RECRUITER,
                    "Application Withdrawn",
                    user.getName() + " withdrew their application for '" + saved.getJob().getTitle() + "'."
            );
        }

        return ApplicationResponse.from(saved);
    }

    // =========================
    // RECRUITER - MY JOB APPLICATIONS
    // =========================

    public List<PlacementApplicationResponse> getApplicationsForRecruiter(
            String username
    ) {

        return applicationRepository
                .findByJob_CreatedByOrderByAppliedAtDesc(username)
                .stream()
                .map(PlacementApplicationResponse::from)
                .toList();
    }

    // =========================
    // PLACEMENT OFFICER - ALL APPLICATIONS
    // =========================

    public List<PlacementApplicationResponse> getAllApplicationsForPlacement(
            Long jobId
    ) {

        List<JobApplication> applications = jobId != null
                ? applicationRepository
                        .findByJobIdOrderByAppliedAtDesc(jobId)
                : applicationRepository
                        .findAllByOrderByAppliedAtDesc();

        return applications
                .stream()
                .map(PlacementApplicationResponse::from)
                .toList();
    }

    // =========================
    // RECRUITER - APPLICATIONS FOR MY JOBS
    // =========================

    public List<PlacementApplicationResponse> getApplicationsForRecruiter(
            String recruiterUsername,
            Long jobId
    ) {

        List<JobApplication> applications = (jobId != null)
                ? applicationRepository
                        .findByJobIdAndJob_CreatedByOrderByAppliedAtDesc(jobId, recruiterUsername)
                : applicationRepository
                        .findByJob_CreatedByOrderByAppliedAtDesc(recruiterUsername);

        return applications
                .stream()
                .map(PlacementApplicationResponse::from)
                .toList();
    }

    // =========================
    // PLACEMENT OFFICER - UPDATE APPLICATION STATUS
    // =========================

    public PlacementApplicationResponse updateStatus(
            Long applicationId,
            ApplicationStatus newStatus,
            String remarks
    ) {

        JobApplication application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found."
                        )
                );

        application.setStatus(newStatus);

        if (remarks != null && !remarks.isBlank()) {
            application.setRemarks(remarks);
        }

        JobApplication saved =
                applicationRepository.save(application);

        notifyStudentOfStatusChange(saved, newStatus, remarks);

        return PlacementApplicationResponse.from(saved);
    }

    // =========================
    // RECRUITER - UPDATE STATUS (OWNERSHIP CHECKED)
    // =========================

    public PlacementApplicationResponse updateStatusAsRecruiter(
            String recruiterUsername,
            Long applicationId,
            ApplicationStatus newStatus,
            String remarks
    ) {

        JobApplication application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found."
                        )
                );

        if (!recruiterUsername.equals(
                application.getJob().getCreatedBy()
        )) {
            throw new RuntimeException(
                    "You can only update applications for your own job postings."
            );
        }

        application.setStatus(newStatus);

        if (remarks != null && !remarks.isBlank()) {
            application.setRemarks(remarks);
        }

        JobApplication saved =
                applicationRepository.save(application);

        notifyStudentOfStatusChange(saved, newStatus, remarks);

        return PlacementApplicationResponse.from(saved);
    }

    private void notifyStudentOfStatusChange(JobApplication application, ApplicationStatus newStatus, String remarks) {
        if (application.getStudent() == null || application.getStudent().getUser() == null) {
            return;
        }
        String studentEmail = application.getStudent().getUser().getEmail();
        String jobTitle = application.getJob() != null ? application.getJob().getTitle() : "Job";
        String companyName = application.getJob() != null ? application.getJob().getCompanyName() : "Company";

        String message;
        String title;
        switch (newStatus) {
            case SHORTLISTED -> {
                title = "Application Shortlisted 🎉";
                message = String.format("Congratulations! You have been shortlisted for '%s' at %s.%s",
                        jobTitle, companyName, (remarks != null && !remarks.isBlank() ? " Note: " + remarks : ""));
            }
            case SELECTED -> {
                title = "Job Offer / Selected! 🎯";
                message = String.format("🎉 Congratulations! You have been SELECTED for '%s' at %s!%s",
                        jobTitle, companyName, (remarks != null && !remarks.isBlank() ? " Note: " + remarks : ""));
            }
            case REJECTED -> {
                title = "Application Update";
                message = String.format("Your application for '%s' at %s was not selected at this time.%s",
                        jobTitle, companyName, (remarks != null && !remarks.isBlank() ? " Feedback: " + remarks : ""));
            }
            case INTERVIEW_SCHEDULED -> {
                title = "Interview Scheduled 📅";
                message = String.format("An interview has been scheduled for your application to '%s' at %s.%s",
                        jobTitle, companyName, (remarks != null && !remarks.isBlank() ? " Details: " + remarks : ""));
            }
            default -> {
                title = "Application Status Updated";
                message = String.format("Your application for '%s' at %s is now: %s.%s",
                        jobTitle, companyName, newStatus, (remarks != null && !remarks.isBlank() ? " Note: " + remarks : ""));
            }
        }

        notificationService.notifyUser(studentEmail, Role.STUDENT, title, message);
    }
}