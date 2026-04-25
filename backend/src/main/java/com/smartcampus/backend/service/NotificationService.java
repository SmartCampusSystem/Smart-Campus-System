package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import java.util.List;

public interface NotificationService {
    
    
    void createNotification(String recipientEmail, String message, String type, String referenceId);
    
   
    void createNotification(String recipientEmail, String senderEmail, String message, String type, String referenceId);

  
    Notification updateNotification(String id, String newMessage);

   
    List<Notification> getAdminAlerts();
    

    List<Notification> getNotificationsForUser(String recipientEmail);
    
    
    long getUnreadCount(String recipientEmail);
    

    Notification markAsRead(String id);
    

    void deleteNotification(String id);
    
    void markAllAsRead(String email);
    
    void clearAllNotifications(String email);
}