package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.AdminAcademicVerificationResponse;
import com.myanatomy.sandboxpro.model.AcademicStatus;
import com.myanatomy.sandboxpro.model.AcademicVerificationRequest;
import com.myanatomy.sandboxpro.model.AcademicVerificationStatus;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.AcademicVerificationRequestRepository;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import com.myanatomy.sandboxpro.model.Role;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminAcademicVerificationService {

    private final AcademicVerificationRequestRepository verificationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AdminAcademicVerificationService(
            AcademicVerificationRequestRepository verificationRepository,
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.verificationRepository = verificationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<AdminAcademicVerificationResponse> getPendingRequests() {

        return verificationRepository
                .findByStatusOrderBySubmittedAtAsc(
                        AcademicVerificationStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminAcademicVerificationResponse getRequestById(
            Long requestId) {

        AcademicVerificationRequest request =
                verificationRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Academic verification request not found"
                                ));

        return toResponse(request);
    }

    @Transactional
    public AdminAcademicVerificationResponse approveRequest(
            Long requestId,
            String adminEmail) {

        AcademicVerificationRequest request =
                verificationRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Academic verification request not found"
                                ));

        // Only PENDING requests can be approved
        if (request.getStatus() !=
                AcademicVerificationStatus.PENDING) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending requests can be approved"
            );
        }

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Admin user not found"
                        ));

        StudentProfile profile =
                request.getStudentProfile();

        // Copy verified academic data to student profile
        profile.setTenthPercentage(
                request.getTenthPercentage()
        );

        profile.setTenthMathPercentage(
                request.getTenthMathPercentage()
        );

        profile.setTwelfthPercentage(
                request.getTwelfthPercentage()
        );

        profile.setTwelfthMathPercentage(
                request.getTwelfthMathPercentage()
        );

        profile.setCgpa(
                request.getCgpa()
        );

        profile.setBacklogs(
                request.getBacklogs()
        );

        profile.setAcademicStatus(
                AcademicStatus.APPROVED
        );

        studentProfileRepository.save(profile);

        // Update verification request
        request.setStatus(
                AcademicVerificationStatus.APPROVED
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        request.setReviewedBy(admin);

        AcademicVerificationRequest saved =
                verificationRepository.save(request);

        if (profile.getUser() != null && profile.getUser().getEmail() != null) {
            notificationService.notifyUser(
                    profile.getUser().getEmail(),
                    Role.STUDENT,
                    "Academic Verification Approved",
                    "Your academic records (CGPA: " + request.getCgpa() + ") have been approved by administration."
            );
        }

        return toResponse(saved);
    }

        @Transactional
        public AdminAcademicVerificationResponse rejectRequest(
                Long requestId,
                String adminEmail,
                String reason) {

        AcademicVerificationRequest request =
                verificationRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Academic verification request not found"
                                ));

        if (request.getStatus() !=
                AcademicVerificationStatus.PENDING) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Only pending requests can be rejected"
                );
        }

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Admin user not found"
                        ));

        StudentProfile profile =
                request.getStudentProfile();

        /*
        * Rejection does NOT update the student's
        * verified academic values.
        */

        profile.setAcademicStatus(
                AcademicStatus.REJECTED
        );

        studentProfileRepository.save(profile);

        request.setStatus(
                AcademicVerificationStatus.REJECTED
        );

        request.setRejectionReason(
                reason.trim()
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        request.setReviewedBy(
                admin
        );

        AcademicVerificationRequest saved =
                verificationRepository.save(request);

        if (profile.getUser() != null && profile.getUser().getEmail() != null) {
            notificationService.notifyUser(
                    profile.getUser().getEmail(),
                    Role.STUDENT,
                    "Academic Verification Rejected",
                    "Your academic verification request was rejected: " + reason.trim()
            );
        }

        return toResponse(saved);
        }

    private AdminAcademicVerificationResponse toResponse(
            AcademicVerificationRequest request) {

        AdminAcademicVerificationResponse response =
                new AdminAcademicVerificationResponse();

        StudentProfile profile =
                request.getStudentProfile();

        response.setRequestId(
                request.getId()
        );

        response.setStudentProfileId(
                profile.getId()
        );

        if (profile.getUser() != null) {

            response.setStudentName(
                    profile.getUser().getName()
            );

            response.setStudentEmail(
                    profile.getUser().getEmail()
            );
        }

        response.setTenthPercentage(
                request.getTenthPercentage()
        );

        response.setTenthMathPercentage(
                request.getTenthMathPercentage()
        );

        response.setTwelfthPercentage(
                request.getTwelfthPercentage()
        );

        response.setTwelfthMathPercentage(
                request.getTwelfthMathPercentage()
        );

        response.setCgpa(
                request.getCgpa()
        );

        response.setBacklogs(
                request.getBacklogs()
        );

        response.setStatus(
                request.getStatus()
        );

        response.setRejectionReason(
                request.getRejectionReason()
        );

        response.setSubmittedAt(
                request.getSubmittedAt()
        );

        response.setReviewedAt(
                request.getReviewedAt()
        );

        return response;
    }
}