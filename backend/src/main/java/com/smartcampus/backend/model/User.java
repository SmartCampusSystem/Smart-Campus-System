package com.smartcampus.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Document(collection = "users") 
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id 
    private String id;

    private String name;

    @Indexed(unique = true) 
    private String email;

    private String password; 

    private String picture;

    private Role role; // ADMIN, USER, TECHNICIAN

    private String provider; 

    private String providerId; 

    @CreatedDate 
    private LocalDateTime createdAt; 
}