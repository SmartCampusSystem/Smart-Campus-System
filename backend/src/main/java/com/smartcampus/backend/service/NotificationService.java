package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import java.util.List;

public interface NotificationService {
    
    // Notification එකක් සෑදීම (Email එක පාවිච්චි කරලා)
    void createNotification(String recipientEmail, String message, String type, String referenceId);
    
    // --- Admin සඳහා අලුතින් එක් කළ කොටස (START) ---
    
    // Admin විසින් senderEmail සහිතව Notification එකක් සෑදීම (Broadcasts/Admin Alerts සඳහා)
    void createNotification(String recipientEmail, String senderEmail, String message, String type, String referenceId);

    // Admin විසින් පණිවිඩයක් Update කිරීම සඳහා
    Notification updateNotification(String id, String newMessage);

    // Admin හට ලැබෙන Alerts (Type = 'ALERT') ලබා ගැනීම සඳහා
    List<Notification> getAdminAlerts();
    
    // --- Admin සඳහා අලුතින් එක් කළ කොටස (END) ---

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