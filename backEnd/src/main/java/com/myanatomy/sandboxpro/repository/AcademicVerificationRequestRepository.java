package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.AcademicVerificationRequest;
import com.myanatomy.sandboxpro.model.AcademicVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcademicVerificationRequestRepository
        extends JpaRepository<AcademicVerificationRequest, Long> {

    List<AcademicVerificationRequest>
    findByStudentProfileIdOrderBySubmittedAtDesc(
            Long studentProfileId
    );

    Optional<AcademicVerificationRequest>
    findFirstByStudentProfileIdAndStatusOrderBySubmittedAtDesc(
            Long studentProfileId,
            AcademicVerificationStatus status
    );

    List<AcademicVerificationRequest>
    findByStatusOrderBySubmittedAtAsc(
            AcademicVerificationStatus status
    );
    List<AcademicVerificationRequest> findByStatus(
        AcademicVerificationStatus status
    );

    long countByStatus(AcademicVerificationStatus status);
}