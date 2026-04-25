package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;
    
    private String resourceId;  
    private String userEmail;   
    
    private LocalDateTime startTime; 
    private LocalDateTime endTime;   
    
    private String purpose;     
    private Integer expectedAttendees; 
    
    private BookingStatus status; 
    private String rejectionReason; 
    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}