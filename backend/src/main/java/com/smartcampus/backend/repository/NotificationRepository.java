package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String email);
    
    long countByRecipientEmailAndIsReadFalse(String email);

    // --- පහත පේළි දෙක අලුතින් එකතු කරන්න ---
    List<Notification> findByRecipientEmailAndIsReadFalse(String email);
    
    List<Notification> findByRecipientEmail(String email);
}