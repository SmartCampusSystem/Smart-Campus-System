package com.smartcampus.backend.dto;

import lombok.Data;

@Data
public class AttachmentDTO {

    private String id;
    private String filename;
    private String fileUrl;
    private String contentType;
    private long fileSize;
}