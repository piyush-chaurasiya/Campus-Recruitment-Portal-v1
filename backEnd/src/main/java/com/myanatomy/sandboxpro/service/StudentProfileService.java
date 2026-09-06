package com.myanatomy.sandboxpro.service;

import com.myanatomy.sandboxpro.dto.PlacementStudentResponse;
import com.myanatomy.sandboxpro.dto.StudentProfileResponse;
import com.myanatomy.sandboxpro.dto.UpdateStudentProfileRequest;
import com.myanatomy.sandboxpro.model.StudentProfile;
import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.StudentProfileRepository;
import com.myanatomy.sandboxpro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;

    public StudentProfileService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository) {

        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public StudentProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        StudentProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(user);
                    return profileRepository.save(newProfile);
                });

        return toResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateProfile(
            String email,
            UpdateStudentProfileRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        StudentProfile profile = profileRepository
                .findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(user);
                    return profileRepository.save(newProfile);
                });

        profile.setPhone(request.getPhone());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPincode(request.getPincode());
        profile.setBranch(request.getBranch());
        profile.setCourse(request.getCourse());
        profile.setPassingYear(request.getPassingYear());
        profile.setSkills(request.getSkills());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());



        StudentProfile saved = profileRepository.save(profile);

        return toResponse(saved);
    }

    private StudentProfileResponse toResponse(
            StudentProfile profile) {

        StudentProfileResponse response =
                new StudentProfileResponse();

        User user = profile.getUser();

        response.setName(user.getName());
        response.setEmail(user.getEmail());

        response.setPhone(profile.getPhone());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setGender(profile.getGender());
        response.setAddress(profile.getAddress());
        response.setCity(profile.getCity());
        response.setState(profile.getState());
        response.setPincode(profile.getPincode());

        response.setBranch(profile.getBranch());
        response.setCourse(profile.getCourse());
        response.setPassingYear(profile.getPassingYear());

        response.setSkills(profile.getSkills());
        response.setGithubUrl(profile.getGithubUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());

        response.setTenthPercentage(
                profile.getTenthPercentage());

        response.setTenthMathPercentage(
                profile.getTenthMathPercentage());

        response.setTwelfthPercentage(
                profile.getTwelfthPercentage());

        response.setTwelfthMathPercentage(
                profile.getTwelfthMathPercentage());

        response.setCgpa(profile.getCgpa());
        response.setBacklogs(profile.getBacklogs());

        response.setAcademicStatus(
                profile.getAcademicStatus());

        return response;
    }

    // =========================
    // PLACEMENT OFFICER - ALL STUDENTS
    // =========================

    @Transactional(readOnly = true)
    public List<PlacementStudentResponse> getAllStudentsForPlacement() {

        return profileRepository
                .findAll()
                .stream()
                .map(PlacementStudentResponse::from)
                .toList();
    }
}