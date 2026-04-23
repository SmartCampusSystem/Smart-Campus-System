package com.smartcampus.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {

    @Id
    private String id;

    private String filename;       // Original filename
    private String storedFilename; // UUID-based stored name
    private String fileUrl;        // Public URL path e.g. /uploads/tickets/abc.jpg
    private String contentType;    // image/jpeg, image/png, image/gif
    private long fileSize;         // bytes
}