package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.AcademicVerificationRequestDto;
import com.myanatomy.sandboxpro.dto.AcademicVerificationResponse;
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
import java.util.Optional;

@Service
public class AcademicVerificationService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final AcademicVerificationRequestRepository verificationRepository;
    private final NotificationService notificationService;

    public AcademicVerificationService(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            AcademicVerificationRequestRepository verificationRepository,
            NotificationService notificationService) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.verificationRepository = verificationRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public AcademicVerificationResponse submitRequest(
            String email,
            AcademicVerificationRequestDto dto) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        StudentProfile profile = studentProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Student profile not found"
                        ));

        /*
         * A student can have many historical requests,
         * but only ONE PENDING request at a time.
         */
        boolean pendingExists =
                verificationRepository
                        .findFirstByStudentProfileIdAndStatusOrderBySubmittedAtDesc(
                                profile.getId(),
                                AcademicVerificationStatus.PENDING
                        )
                        .isPresent();

        if (pendingExists) {

            AcademicVerificationResponse response =
                    new AcademicVerificationResponse();

            response.setStatus(
                    AcademicVerificationStatus.PENDING
            );

            response.setMessage(
                    "You already have a pending academic verification request"
            );

            return response;
        }

        /*
         * APPROVED or REJECTED previous requests are NOT deleted.
         * A new request is created for every new submission.
         */
        AcademicVerificationRequest request =
                new AcademicVerificationRequest();

        request.setStudentProfile(profile);

        request.setTenthPercentage(
                dto.getTenthPercentage()
        );

        request.setTenthMathPercentage(
                dto.getTenthMathPercentage()
        );

        request.setTwelfthPercentage(
                dto.getTwelfthPercentage()
        );

        request.setTwelfthMathPercentage(
                dto.getTwelfthMathPercentage()
        );

        request.setCgpa(
                dto.getCgpa()
        );

        request.setBacklogs(
                dto.getBacklogs()
        );

        request.setStatus(
                AcademicVerificationStatus.PENDING
        );

        request.setSubmittedAt(
                LocalDateTime.now()
        );

        AcademicVerificationRequest saved =
                verificationRepository.save(request);

        notificationService.notifyRole(
                Role.ADMIN,
                "Academic Verification Request",
                user.getName() + " (" + user.getEmail() + ") submitted academic details for verification (CGPA: " + dto.getCgpa() + ")."
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Optional<AcademicVerificationResponse> getLatestRequest(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

        StudentProfile profile = studentProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Student profile not found"
                        ));

        return verificationRepository
                .findByStudentProfileIdOrderBySubmittedAtDesc(
                        profile.getId()
                )
                .stream()
                .findFirst()
                .map(this::toResponse);
    }

    private AcademicVerificationResponse toResponse(
            AcademicVerificationRequest request) {

        AcademicVerificationResponse response =
                new AcademicVerificationResponse();

        response.setRequestId(
                request.getId()
        );

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