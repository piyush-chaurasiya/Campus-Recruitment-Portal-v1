package com.myanatomy.sandboxpro.dto;

import com.myanatomy.sandboxpro.model.AcademicStatus;
import com.myanatomy.sandboxpro.model.StudentProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlacementStudentResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;

    private String branch;
    private String course;
    private Integer passingYear;

    private Double cgpa;
    private Integer backlogs;
    private Double tenthPercentage;
    private Double twelfthPercentage;

    private AcademicStatus academicStatus;
    private Boolean hasResume;

    public static PlacementStudentResponse from(StudentProfile profile) {

        PlacementStudentResponse response =
                new PlacementStudentResponse();

        response.setId(profile.getId());
        response.setName(profile.getUser().getName());
        response.setEmail(profile.getUser().getEmail());
        response.setPhone(profile.getPhone());

        response.setBranch(profile.getBranch());
        response.setCourse(profile.getCourse());
        response.setPassingYear(profile.getPassingYear());

        response.setCgpa(profile.getCgpa());
        response.setBacklogs(profile.getBacklogs());
        response.setTenthPercentage(profile.getTenthPercentage());
        response.setTwelfthPercentage(profile.getTwelfthPercentage());

        response.setAcademicStatus(profile.getAcademicStatus());
        response.setHasResume(profile.getResumeName() != null);

        return response;
    }
}
