package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.RecruiterProfileResponse;
import com.myanatomy.sandboxpro.dto.UpdateRecruiterProfileRequest;
import com.myanatomy.sandboxpro.model.RecruiterProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.RecruiterProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class RecruiterProfileService {

    private final RecruiterProfileRepository profileRepository;
    private final UserRepository userRepository;

    public RecruiterProfileService(
            RecruiterProfileRepository profileRepository,
            UserRepository userRepository
    ) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public RecruiterProfileResponse getProfile(String email) {

        RecruiterProfile profile = getOrCreate(email);

        return RecruiterProfileResponse.from(profile);
    }

    public RecruiterProfileResponse updateProfile(
            String email,
            UpdateRecruiterProfileRequest request
    ) {

        RecruiterProfile profile = getOrCreate(email);

        profile.setCompanyName(request.getCompanyName());
        profile.setWebsite(request.getWebsite());
        profile.setIndustry(request.getIndustry());
        profile.setLocation(request.getLocation());
        profile.setDescription(request.getDescription());

        RecruiterProfile saved =
                profileRepository.save(profile);

        return RecruiterProfileResponse.from(saved);
    }

    private RecruiterProfile getOrCreate(String email) {

        return profileRepository
                .findByUserEmail(email)
                .orElseGet(() -> {

                    User user = userRepository
                            .findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found."
                                    )
                            );

                    RecruiterProfile profile =
                            new RecruiterProfile();

                    profile.setUser(user);

                    return profileRepository.save(profile);
                });
    }
}
