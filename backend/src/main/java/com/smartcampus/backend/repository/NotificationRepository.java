package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    // Email එක අනුව අලුත්ම පණිවිඩ මුලින්ම ලබා ගැනීම
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    
    // කියවා නැති පණිවිඩ ගණන බැලීමට
    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}