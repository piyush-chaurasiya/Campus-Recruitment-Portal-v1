package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.Job;
import com.myanatomy.sandboxpro.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findAllByOrderByCreatedAtDesc();

    List<Job> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    long countByStatus(JobStatus status);
}