package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.model.JobApplication;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.JobApplicationRepository;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import com.myanatomy.sandboxpro.service.storage.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentResumeService {

    private static final Logger log = LoggerFactory.getLogger(StudentResumeService.class);

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final JobApplicationRepository applicationRepository;
    private final FileStorageService fileStorageService;

    public StudentResumeService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            JobApplicationRepository applicationRepository,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.applicationRepository = applicationRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public String uploadResume(String email, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please select a resume.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Resume size must be 5 MB or less.");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Invalid file name.");
        }

        if (!filename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF resumes are allowed.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + user.getId()));

        // Delete previous file if exists
        if (profile.getResumePath() != null) {
            fileStorageService.delete(profile.getResumePath());
        }

        String storedPath = fileStorageService.store(file, String.valueOf(user.getId()));

        profile.setResumePath(storedPath);
        profile.setResumeName(filename);
        profile.setResumeContentType(MediaType.APPLICATION_PDF_VALUE);
        profile.setResumeData(null); // Keep database clean

        profileRepository.save(profile);
        log.info("Resume successfully uploaded for user {}", email);

        return filename;
    }

    public ResumePayload getResume(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + user.getId()));

        return getResumeByProfile(profile);
    }

    public ResumePayload getResumeByProfile(StudentProfile profile) {
        if (profile == null) return null;

        byte[] data = null;
        if (profile.getResumePath() != null) {
            data = fileStorageService.loadAsBytes(profile.getResumePath());
        }

        // Fallback for legacy DB blob
        if (data == null && profile.getResumeData() != null) {
            data = profile.getResumeData();
        }

        if (data == null || data.length == 0) {
            return null;
        }

        String filename = profile.getResumeName() == null ? "resume.pdf" : profile.getResumeName();
        String contentType = profile.getResumeContentType() != null ? profile.getResumeContentType() : MediaType.APPLICATION_PDF_VALUE;
        return new ResumePayload(filename, contentType, data);
    }

    public ResumePayload getResumeByStudentProfileId(Long profileId) {
        StudentProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Student profile not found: " + profileId));
        return getResumeByProfile(profile);
    }

    public ResumePayload getResumeForRecruiter(Long applicationId, String recruiterEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        if (!recruiterEmail.equals(application.getJob().getCreatedBy())) {
            throw new AccessDeniedException("You are not authorized to view resumes for this application.");
        }

        return getResumeByProfile(application.getStudent());
    }

    public ResumePayload getResumeForPlacementApplication(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        return getResumeByProfile(application.getStudent());
    }

    @Transactional
    public void deleteResume(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        StudentProfile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + user.getId()));

        if (profile.getResumePath() != null) {
            fileStorageService.delete(profile.getResumePath());
        }

        profile.setResumePath(null);
        profile.setResumeData(null);
        profile.setResumeName(null);
        profile.setResumeContentType(null);

        profileRepository.save(profile);
        log.info("Resume deleted for user {}", email);
    }

    public record ResumePayload(String filename, String contentType, byte[] data) {}
}
