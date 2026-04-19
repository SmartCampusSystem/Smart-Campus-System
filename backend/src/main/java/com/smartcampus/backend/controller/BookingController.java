package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // 1. අලුත් Booking එකක් සිදු කිරීම (නිවැරදි කළා)
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required to book");
        }
        booking.setUserEmail(principal.getName());
        booking.setStatus(Booking.BookingStatus.PENDING); // Default status එක set කිරීම
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    // 2. තමාගේ වෙන් කිරීම් පමණක් බැලීම (මෙහි තමයි කලින් වැරැද්ද තිබුණේ)
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Principal principal) {
        // Principal null නම් HTML එකක් වෙනුවට JSON එකක් ලෙස 401 code එක ලබා දීම
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please login again.");
        }
        
        List<Booking> myBookings = bookingService.getMyBookings(principal.getName());
        return ResponseEntity.ok(myBookings); // React එකට Array එකක්ම ලැබෙන බව තහවුරු කරයි
    }

    // 3. සියලුම වෙන් කිරීම් බැලීම (Admin පමණි)
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 4. Status වෙනස් කිරීම සහ 5. Cancel කිරීම ඔබ එවූ පරිදිම පවතී...
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestParam Booking.BookingStatus status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}