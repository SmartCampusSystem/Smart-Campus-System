package com.smartcampus.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    private String id;

    private String text;
    private String authorEmail;   // Used for ownership checks (edit/delete)
    private String authorName;    // Display name

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}