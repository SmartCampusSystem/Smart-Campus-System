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

    // 3. POST - අලුත් notification එකක් සෑදීම (පැරණි ක්‍රමය - User Side එකට)
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

    /* --- ADMIN සඳහා අලුතින් එක් කළ කොටස (START) --- */

    // 6. POST - Admin විසින් සියලුම දෙනාට පණිවිඩ යැවීම (Broadcast) හෝ නිශ්චිත කෙනෙකුට senderEmail සහිතව යැවීම
    @PostMapping("/admin/send")
    public ResponseEntity<String> adminCreate(@RequestBody Notification notification) {
        notificationService.createNotification(
                notification.getRecipientEmail(), // "ALL" හෝ අදාළ Email
                notification.getSenderEmail(),    // Admin's Email
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId()
        );
        return new ResponseEntity<>("Admin notification sent successfully", HttpStatus.CREATED);
    }

    // 7. GET - Admin ට ලැබෙන Alerts (Requests) ලබා ගැනීම (Type = "ALERT")
    @GetMapping("/admin/alerts")
    public ResponseEntity<List<Notification>> getAdminAlerts() {
        // NotificationServiceImpl හි අලුතින් සෑදූ getAdminAlerts method එක භාවිතා කරයි
        return new ResponseEntity<>(notificationService.getAdminAlerts(), HttpStatus.OK);
    }

    // 8. GET - Admin යැවූ Broadcast History එක ලබා ගැනීම (recipientEmail = "ALL")
    @GetMapping("/admin/broadcast-history")
    public ResponseEntity<List<Notification>> getBroadcastHistory() {
        return new ResponseEntity<>(notificationService.getNotificationsForUser("ALL"), HttpStatus.OK);
    }

    // 9. PUT - Admin විසින් යැවූ පණිවිඩයක් Update කිරීම
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<Notification> adminUpdate(@PathVariable String id, @RequestBody Notification notification) {
        return new ResponseEntity<>(notificationService.updateNotification(id, notification.getMessage()), HttpStatus.OK);
    }

    // 10. DELETE - Admin විසින් යැවූ පණිවිඩයක් Archive/Delete කිරීම
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> adminDelete(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /* --- ADMIN සඳහා අලුතින් එක් කළ කොටස (END) --- */

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

    @PutMapping("/user/{email}/read-all")
    public ResponseEntity<Void> markAllRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{email}/clear")
    public ResponseEntity<Void> clearAll(@PathVariable String email) {
        notificationService.clearAllNotifications(email);
        return ResponseEntity.ok().build();
    }
}