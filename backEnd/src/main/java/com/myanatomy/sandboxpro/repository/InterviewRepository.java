package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplication_Job_CreatedByOrderByScheduledTimeDesc(String createdBy);

    List<Interview> findByApplication_Student_User_EmailOrderByScheduledTimeDesc(String email);

    List<Interview> findByApplicationIdOrderByScheduledTimeDesc(Long applicationId);
}
