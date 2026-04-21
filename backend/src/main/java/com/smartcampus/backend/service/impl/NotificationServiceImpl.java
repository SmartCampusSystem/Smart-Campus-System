package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void createNotification(String email, String message, String type, String referenceId) {
        Notification notification = new Notification(email, message, type, referenceId);
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    @Override
    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    @Override
    public Notification markAsRead(String id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    @Override
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }

    @Override
public void markAllAsRead(String email) {
    List<Notification> notifications = notificationRepository.findByRecipientEmailAndIsReadFalse(email);
    notifications.forEach(n -> n.setRead(true));
    notificationRepository.saveAll(notifications);
}

@Override
public void clearAllNotifications(String email) {
    List<Notification> notifications = notificationRepository.findByRecipientEmail(email);
    notificationRepository.deleteAll(notifications);
}
}