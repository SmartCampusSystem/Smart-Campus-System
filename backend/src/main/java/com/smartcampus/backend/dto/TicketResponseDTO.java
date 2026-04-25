package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.Ticket.TicketStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponseDTO {

    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private TicketStatus status;

    private String resourceId;
    
    // Structured Location Fields
    private String buildingName;
    private String floor;
    private String block;
    private String roomNumber;
    private String location;

    private String creatorEmail;
    private String creatorName;
    private String preferredContact;

    private String assignedTechnician;
    private String resolutionNote;
    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<CommentDTO> comments;
    private List<AttachmentDTO> attachments;
}