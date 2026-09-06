package com.myanatomy.sandboxpro.controller;

import com.myanatomy.sandboxpro.service.StudentResumeService;
import com.myanatomy.sandboxpro.service.StudentResumeService.ResumePayload;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/student/resume")
public class StudentResumeController {

    private final StudentResumeService resumeService;

    public StudentResumeController(StudentResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping
    public ResponseEntity<?> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated."));
        }

        String savedFilename = resumeService.uploadResume(authentication.getName(), file);

        return ResponseEntity.ok(Map.of(
                "message", "Resume uploaded successfully.",
                "name", savedFilename
        ));
    }

    @GetMapping
    public ResponseEntity<byte[]> getResume(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ResumePayload payload = resumeService.getResume(authentication.getName());
        if (payload == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(payload.filename())
                        .build()
        );

        return new ResponseEntity<>(payload.data(), headers, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteResume(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User is not authenticated."));
        }

        resumeService.deleteResume(authentication.getName());

        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully."));
    }
}
