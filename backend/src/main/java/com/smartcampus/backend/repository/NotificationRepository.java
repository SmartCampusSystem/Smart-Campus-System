package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String email);
    
    long countByRecipientEmailAndIsReadFalse(String email);

    // --- පහත පේළි දෙක අලුතින් එකතු කළා ---
    
    // කියවා නැති පණිවිඩ ලැයිස්තුව පමණක් ලබා ගැනීමට
    List<Notification> findByRecipientEmailAndIsReadFalse(String email);
    
    // ඕනෑම email එකකට අදාළ (උදා: "ADMIN" හෝ "ALL") පණිවිඩ ලැයිස්තුව ලබා ගැනීමට
    List<Notification> findByRecipientEmail(String email);
    List<Notification> findByTypeOrderByCreatedAtDesc(String type);
}