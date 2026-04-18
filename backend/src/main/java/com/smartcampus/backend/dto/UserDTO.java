package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;        // Long ඉඳන් String වලට මාරු කළා (MongoDB ID එකට ගැලපෙන්න)
    private String name;
    private String email;
    private String picture;
    private String role; 
    private String provider; 
    private LocalDateTime createdAt; 
}