package com.smartcampus.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    private String id;

    // Core fields
    private String title;
    private String description;
    private String category;         // ELECTRICAL, PLUMBING, IT_EQUIPMENT, FURNITURE, OTHER
    private String priority;         // LOW, MEDIUM, HIGH, CRITICAL

    private TicketStatus status = TicketStatus.OPEN;

    // Location / Resource link
    private String resourceId;       // Optional: linked resource from Module A

    // Structured Location Fields
    private String buildingName;     // Building name
    private String floor;           // Floor number/name
    private String block;           // Block identification
    private String roomNumber;      // Room number
    private String location;         // Free-text location description

    // Creator info
    private String creatorEmail;     // Set from Principal (logged-in user)
    private String creatorName;

    private String preferredContact; // Phone/email for follow-up

    // Technician assignment
    private String assignedTechnician; // Technician's email

    // Resolution & rejection
    private String resolutionNote;
    private String rejectionReason;

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    // Embedded sub-documents
    private List<Comment> comments = new ArrayList<>();
    private List<Attachment> attachments = new ArrayList<>(); // max 3 images

    /**
     * Ticket Status Workflow:
     * OPEN → IN_PROGRESS → RESOLVED → CLOSED
     *                   └→ REJECTED  (Admin only, with reason)
     */
    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        REJECTED
    }
}