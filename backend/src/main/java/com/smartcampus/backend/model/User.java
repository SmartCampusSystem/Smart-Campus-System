package com.smartcampus.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Document(collection = "users") // MySQL වල @Table වෙනුවට
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id // MongoDB වල ID එක සාමාන්‍යයෙන් String එකක් (ObjectId) ලෙස තබා ගැනීම වඩාත් සුදුසුයි
    private String id;

    private String name;

    @Indexed(unique = true) // MySQL වල unique = true වෙනුවට
    private String email;

    private String password; // Google users ලට password එකක් නැති නිසා මෙය nullable විය හැකියි

    private String picture;

    private Role role; // ADMIN, USER, TECHNICIAN

    private String provider; // LOCAL හෝ GOOGLE

    private String providerId; // Google 'sub' ID එක

    @CreatedDate // Hibernate @CreationTimestamp වෙනුවට Spring Data MongoDB Annotation එක
    private LocalDateTime createdAt; 
}