package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*") 
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // 1. GET - අදාළ Email එක හිමි පරිශීලකයාගේ සියලුම notifications ලබා ගැනීම
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String email) {
        return new ResponseEntity<>(notificationService.getNotificationsForUser(email), HttpStatus.OK);
    }

    // 2. GET - කියවා නැති පණිවිඩ ගණන (Badge/Bell icon එක පෙන්වීමට)
    @GetMapping("/user/{email}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String email) {
        return new ResponseEntity<>(notificationService.getUnreadCount(email), HttpStatus.OK);
    }

    // 3. POST - අලුත් notification එකක් සෑදීම
    @PostMapping
    public ResponseEntity<String> create(@RequestBody Notification notification) {
        notificationService.createNotification(
                notification.getRecipientEmail(),
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId()
        );
        return new ResponseEntity<>("Notification created successfully", HttpStatus.CREATED);
    }

    // 4. PUT - කියවූ බව mark කිරීම
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return new ResponseEntity<>(notificationService.markAsRead(id), HttpStatus.OK);
    }

    // 5. DELETE - notification එකක් ඉවත් කිරීම
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}