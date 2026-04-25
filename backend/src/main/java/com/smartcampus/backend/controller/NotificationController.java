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

    
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String email) {
        return new ResponseEntity<>(notificationService.getNotificationsForUser(email), HttpStatus.OK);
    }

    
    @GetMapping("/user/{email}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String email) {
        return new ResponseEntity<>(notificationService.getUnreadCount(email), HttpStatus.OK);
    }

    
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



    
    @PostMapping("/admin/send")
    public ResponseEntity<String> adminCreate(@RequestBody Notification notification) {
        notificationService.createNotification(
                notification.getRecipientEmail(), 
                notification.getSenderEmail(),    
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId()
        );
        return new ResponseEntity<>("Admin notification sent successfully", HttpStatus.CREATED);
    }

    
    @GetMapping("/admin/alerts")
    public ResponseEntity<List<Notification>> getAdminAlerts() {
       
        return new ResponseEntity<>(notificationService.getAdminAlerts(), HttpStatus.OK);
    }

 
    @GetMapping("/admin/broadcast-history")
    public ResponseEntity<List<Notification>> getBroadcastHistory() {
        return new ResponseEntity<>(notificationService.getNotificationsForUser("ALL"), HttpStatus.OK);
    }

    @PutMapping("/admin/update/{id}")
    public ResponseEntity<Notification> adminUpdate(@PathVariable String id, @RequestBody Notification notification) {
        return new ResponseEntity<>(notificationService.updateNotification(id, notification.getMessage()), HttpStatus.OK);
    }

    
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> adminDelete(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

  


    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return new ResponseEntity<>(notificationService.markAsRead(id), HttpStatus.OK);
    }

    
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