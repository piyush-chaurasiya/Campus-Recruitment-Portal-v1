package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.model.Role;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner createUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            createOrUpdateUser(userRepository, passwordEncoder,
                    "Student User",
                    "student@campus.com",
                    "Student@123",
                    Role.STUDENT);

            createOrUpdateUser(userRepository, passwordEncoder,
                    "Recruiter User",
                    "recruiter@campus.com",
                    "Recruiter@123",
                    Role.RECRUITER);

            createOrUpdateUser(userRepository, passwordEncoder,
                    "Placement Officer",
                    "officer@campus.com",
                    "Officer@123",
                    Role.PLACEMENT_OFFICER);

            createOrUpdateUser(userRepository, passwordEncoder,
                    "Admin User",
                    "admin@campus.com",
                    "Admin@123",
                    Role.ADMIN);
        };
    }

    private void createOrUpdateUser(
            UserRepository repository,
            PasswordEncoder encoder,
            String name,
            String email,
            String password,
            Role role) {

        String normalizedEmail = email.trim().toLowerCase();
        User user = repository.findByEmail(normalizedEmail).orElse(null);

        if (user == null) {
            user = new User(
                    name,
                    normalizedEmail,
                    encoder.encode(password),
                    role
            );
            user.setEnabled(true);
            repository.save(user);
            log.info("Created seed user: {}", normalizedEmail);
        } else {
            user.setName(name);
            user.setPassword(encoder.encode(password));
            user.setRole(role);
            user.setEnabled(true);
            repository.save(user);
            log.info("Refreshed seed user password and status: {}", normalizedEmail);
        }
    }
}
