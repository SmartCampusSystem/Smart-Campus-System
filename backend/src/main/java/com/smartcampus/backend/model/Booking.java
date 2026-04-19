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
    
    private String resourceId;  // Module A හි සම්පතේ ID එක [cite: 52]
    private String userEmail;   // වෙන් කිරීම සිදු කරන පරිශීලකයා [cite: 56]
    
    private LocalDateTime startTime; // ආරම්භක වේලාව [cite: 56]
    private LocalDateTime endTime;   // අවසාන වේලාව [cite: 56]
    
    private String purpose;      // වෙන් කිරීමේ අරමුණ [cite: 56]
    private Integer expectedAttendees; // සහභාගී වන්නන් ගණන [cite: 56]
    
    private BookingStatus status; // Workflow: PENDING -> APPROVED/REJECTED 
    private String rejectionReason; // Reject කිරීමට හේතුව [cite: 64]

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}