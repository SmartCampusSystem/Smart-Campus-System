package com.smartcampus.backend.dto;

import lombok.Data;

@Data
public class TicketRequestDTO {

    private String title;
    private String description;
    private String category;         // ELECTRICAL, PLUMBING, IT_EQUIPMENT, FURNITURE, OTHER
    private String priority;         // LOW, MEDIUM, HIGH, CRITICAL
    private String resourceId;       // Optional: link to a resource from Module A
    
    // Structured Location Fields
    private String buildingName;     // Building name
    private String floor;           // Floor number/name
    private String block;           // Block identification
    private String roomNumber;      // Room number
    private String location;         // Free-text location
    
    private String preferredContact; // Preferred contact details
}