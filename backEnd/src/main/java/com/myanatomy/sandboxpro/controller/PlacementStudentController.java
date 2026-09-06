package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.dto.PlacementStudentResponse;
import com.myanatomy.sandboxpro.service.StudentProfileService;
import com.myanatomy.sandboxpro.service.StudentResumeService;
import com.myanatomy.sandboxpro.service.StudentResumeService.ResumePayload;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/placement/students")
public class PlacementStudentController {

    private final StudentProfileService studentProfileService;
    private final StudentResumeService resumeService;

    public PlacementStudentController(
            StudentProfileService studentProfileService,
            StudentResumeService resumeService
    ) {
        this.studentProfileService = studentProfileService;
        this.resumeService = resumeService;
    }

    @GetMapping
    public List<PlacementStudentResponse> getAllStudents() {
        return studentProfileService.getAllStudentsForPlacement();
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> getStudentResume(@PathVariable Long id) {
        ResumePayload payload = resumeService.getResumeByStudentProfileId(id);
        if (payload == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(payload.contentType()));
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(payload.filename())
                        .build()
        );

        return new ResponseEntity<>(payload.data(), headers, HttpStatus.OK);
    }
}
