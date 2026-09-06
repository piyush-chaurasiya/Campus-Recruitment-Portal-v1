package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StudentProfileInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileInitializer(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository) {

        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    @Override
    public void run(String... args) {

        userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .forEach(this::createProfileIfMissing);
    }

    private void createProfileIfMissing(User user) {

        if (!studentProfileRepository.existsByUserId(user.getId())) {

            StudentProfile profile = new StudentProfile();

            profile.setUser(user);

            studentProfileRepository.save(profile);
        }
    }
}