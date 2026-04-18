package com.smartcampus.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Google users ලට password එකක් නැති නිසා මෙය nullable විය යුතුයි
    private String password;

    private String picture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN, USER, TECHNICIAN [cite: 49]

    @Column(nullable = false)
    private String provider; // LOCAL හෝ GOOGLE (මෙය login එක හඳුනා ගැනීමට වැදගත්)

    private String providerId; // Google 'sub' ID එක

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt; // Auditability සඳහා 
}