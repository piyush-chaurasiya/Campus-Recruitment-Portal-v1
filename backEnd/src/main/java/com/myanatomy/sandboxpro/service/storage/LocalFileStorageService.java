package com.myanatomy.sandboxpro.service.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFileStorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalFileStorageService.class);

    private final Path rootLocation;

    public LocalFileStorageService(@Value("${app.upload.dir:uploads/resumes}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            if (!Files.exists(this.rootLocation)) {
                Files.createDirectories(this.rootLocation);
            }
        } catch (IOException e) {
            log.error("Could not initialize storage directory", e);
            throw new RuntimeException("Could not initialize storage directory: " + e.getMessage());
        }
    }

    @Override
    public String store(MultipartFile file, String prefix) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IllegalArgumentException("File name is invalid.");
        }

        String safeFileName = originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        String uniqueFileName = prefix + "_" + System.currentTimeMillis() + "_" + safeFileName;
        Path destinationFile = this.rootLocation.resolve(uniqueFileName);

        try {
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
            return destinationFile.toString();
        } catch (IOException e) {
            log.error("Failed to store file {}", originalFilename, e);
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    @Override
    public byte[] loadAsBytes(String filePath) {
        if (filePath == null) return null;
        Path file = Paths.get(filePath).normalize().toAbsolutePath();
        Path root = this.rootLocation.normalize().toAbsolutePath();

        if (!file.startsWith(root)) {
            log.warn("Blocked potential path traversal access to: {}", filePath);
            throw new SecurityException("Unauthorized file path access.");
        }

        if (!Files.exists(file)) return null;

        try {
            return Files.readAllBytes(file);
        } catch (IOException e) {
            log.error("Failed to read file {}", filePath, e);
            throw new RuntimeException("Failed to read file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String filePath) {
        if (filePath == null) return;
        Path file = Paths.get(filePath).normalize().toAbsolutePath();
        Path root = this.rootLocation.normalize().toAbsolutePath();

        if (!file.startsWith(root)) {
            log.warn("Blocked potential path traversal deletion of: {}", filePath);
            return;
        }

        try {
            Files.deleteIfExists(file);
        } catch (IOException e) {
            log.warn("Could not delete file {}: {}", filePath, e.getMessage());
        }
    }
}
