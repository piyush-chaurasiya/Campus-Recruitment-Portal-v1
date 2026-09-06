package com.myanatomy.sandboxpro.repository;

import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);

    Optional<StudentProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}