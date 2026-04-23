package com.smartcampus.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {

    private String id;
    private String text;
    private String authorEmail;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}