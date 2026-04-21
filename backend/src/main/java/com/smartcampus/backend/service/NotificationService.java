package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import java.util.List;

public interface NotificationService {
    
    // Notification එකක් සෑදීම (Email එක පාවිච්චි කරලා)
    void createNotification(String recipientEmail, String message, String type, String referenceId);
    
    // User ගේ Email එකට අදාළ සියලුම පණිවිඩ ලබා ගැනීම
    List<Notification> getNotificationsForUser(String recipientEmail);
    
    // කියවා නැති පණිවිඩ ගණන ලබා ගැනීම (Bell icon badge එකට)
    long getUnreadCount(String recipientEmail);
    
    // පණිවිඩයක් කියවූ බව mark කිරීම
    Notification markAsRead(String id);
    
    // පණිවිඩයක් ඉවත් කිරීම
    void deleteNotification(String id);
    void markAllAsRead(String email);
    void clearAllNotifications(String email);
}