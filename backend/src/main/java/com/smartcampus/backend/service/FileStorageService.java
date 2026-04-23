package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Attachment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public Attachment store(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Only image files (JPEG, PNG, GIF, WEBP) are allowed. Got: " + contentType);
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size exceeds 5 MB limit: " + file.getOriginalFilename());
        }

        Path targetDir = Paths.get(uploadDir, "tickets");
        Files.createDirectories(targetDir);

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) extension = originalFilename.substring(dotIndex);

        String storedFilename = UUID.randomUUID().toString() + extension;
        Path targetPath = targetDir.resolve(storedFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        Attachment attachment = new Attachment();
        attachment.setId(UUID.randomUUID().toString());
        attachment.setFilename(originalFilename);
        attachment.setStoredFilename(storedFilename);
        attachment.setFileUrl("/uploads/tickets/" + storedFilename);
        attachment.setContentType(contentType);
        attachment.setFileSize(file.getSize());
        return attachment;
    }

    public void delete(String storedFilename) {
        try {
            Path filePath = Paths.get(uploadDir, "tickets", storedFilename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Warning: could not delete file: " + storedFilename + " — " + e.getMessage());
        }
    }
}