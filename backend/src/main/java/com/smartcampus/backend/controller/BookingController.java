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

  
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required to book");
        }
        booking.setUserEmail(principal.getName());
        booking.setStatus(Booking.BookingStatus.PENDING); 
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

   
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Principal principal) {
       
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired. Please login again.");
        }
        
        List<Booking> myBookings = bookingService.getMyBookings(principal.getName());
        return ResponseEntity.ok(myBookings); 
    }

   
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

   
@GetMapping("/{id}")
public ResponseEntity<?> getBookingById(@PathVariable String id, Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
    }
    
    Booking booking = bookingService.getBookingById(id);
    
    // if (!booking.getUserEmail().equals(principal.getName())) {
    //     return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    // }

    return ResponseEntity.ok(booking);
}
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