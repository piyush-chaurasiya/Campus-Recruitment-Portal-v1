package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.RecruiterProfile;

public class RecruiterProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String companyName;
    private String website;
    private String industry;
    private String location;
    private String description;

    public RecruiterProfileResponse() {
    }

    public static RecruiterProfileResponse from(RecruiterProfile profile) {
        RecruiterProfileResponse response = new RecruiterProfileResponse();
        response.setId(profile.getId());
        if (profile.getUser() != null) {
            response.setName(profile.getUser().getName());
            response.setEmail(profile.getUser().getEmail());
        }
        response.setCompanyName(profile.getCompanyName());
        response.setWebsite(profile.getWebsite());
        response.setIndustry(profile.getIndustry());
        response.setLocation(profile.getLocation());
        response.setDescription(profile.getDescription());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
