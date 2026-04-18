package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String picture;
    private String role;     // ADMIN, USER, TECHNICIAN [cite: 49]
    private String provider; // LOCAL හෝ GOOGLE
    private LocalDateTime createdAt; // Auditability සඳහා 
}