package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.RecruiterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository
        extends JpaRepository<RecruiterProfile, Long> {

    Optional<RecruiterProfile> findByUserEmail(String email);
}
