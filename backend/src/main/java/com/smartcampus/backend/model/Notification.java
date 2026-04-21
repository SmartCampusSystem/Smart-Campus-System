package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    // Local login එකේ email එක හෝ OAuth එකෙන් එන email එක මෙතනට දාන්න
    private String recipientEmail; 
    
    private String message;     // පණිවිඩය (e.g. Your booking is approved)
    private String type;        // BOOKING, TICKET, හෝ COMMENT
    private String referenceId; // Booking ID හෝ Ticket ID (Object ID එක)
    private boolean isRead;
    private LocalDateTime createdAt;

    // Default Constructor
    public Notification() {}

    // පහසුවෙන් Notification එකක් සාදා ගැනීමට Constructor එක
    public Notification(String recipientEmail, String message, String type, String referenceId) {
        this.recipientEmail = recipientEmail;
        this.message = message;
        this.type = type;
        this.referenceId = referenceId;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}