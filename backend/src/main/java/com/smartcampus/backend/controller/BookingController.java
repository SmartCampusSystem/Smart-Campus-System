package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. අලුත් Booking එකක් සිදු කිරීම (User)
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Principal principal) {
        if (principal != null) {
            booking.setUserEmail(principal.getName()); // Login වී සිටින පරිශීලකයාගේ email එක ඇතුළත් කිරීම
        }
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // 2. තමාගේ වෙන් කිරීම් පමණක් බැලීම (User)
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getName()));
    }

    // 3. සියලුම වෙන් කිරීම් බැලීම (Admin පමණි)
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 4. Booking එකක තත්ත්වය (Status) වෙනස් කිරීම (Admin පමණි)
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestParam Booking.BookingStatus status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    // 5. Booking එකක් අවලංගු කිරීම (User/Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}