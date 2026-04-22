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

    // 1. පවතින Method එක (User Side එක සඳහා - වෙනස් කර නැත)
    @Override
    public void createNotification(String email, String message, String type, String referenceId) {
        Notification notification = new Notification(email, message, type, referenceId);
        notificationRepository.save(notification);
    }

    // --- Admin සඳහා අලුතින් එක් කළ කොටස (START) ---

    // 2. Admin විසින් පණිවිඩ යැවීමේදී (senderEmail සහිතව) භාවිතා කරන Overloaded Method එක
    @Override
    public void createNotification(String email, String senderEmail, String message, String type, String referenceId) {
        Notification notification = new Notification(email, senderEmail, message, type, referenceId);
        notificationRepository.save(notification);
    }

    // 3. Admin විසින් පණිවිඩයක් Update කිරීමේදී භාවිතා කරන Method එක
    @Override
    public Notification updateNotification(String id, String newMessage) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setMessage(newMessage);
        return notificationRepository.save(notification);
    }

    // 4. Admin Alerts (Booking requests වැනි දේ) ලබා ගැනීම සඳහා එක් කළ Method එක
    @Override
    public List<Notification> getAdminAlerts() {
        // මෙහිදී 'ALERT' type එක සහිත සියලුම notifications ලබා ගනී (Booking Requests මෙයට අයත් වේ)
        return notificationRepository.findByTypeOrderByCreatedAtDesc("ALERT");
    }

    // --- Admin සඳහා අලුතින් එක් කළ කොටස (END) ---

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