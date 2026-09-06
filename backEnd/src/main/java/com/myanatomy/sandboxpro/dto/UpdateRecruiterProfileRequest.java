package com.myanatomy.sandboxpro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRecruiterProfileRequest {
    private String companyName;
    private String website;
    private String industry;
    private String location;
    private String description;
}
