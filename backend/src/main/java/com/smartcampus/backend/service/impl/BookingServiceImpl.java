package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.service.BookingService;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Booking createBooking(Booking booking) {
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("This resource is already booked for the selected time period.");
        }

        booking.setStatus(Booking.BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        // ✅ Logic for sending Admin Alert:
        String adminAlertMessage = "New Booking Request from " + savedBooking.getUserEmail() + " for " + savedBooking.getResourceId();
        notificationService.createNotification(
                "ADMIN", 
                "SYSTEM", 
                adminAlertMessage, 
                "ALERT", 
                savedBooking.getId()
        );

        return savedBooking;
    }

    @Override
    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmail(email).stream()
                .sorted((b1, b2) -> b2.getStartTime().compareTo(b1.getStartTime()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking updateBookingStatus(String id, Booking.BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
        
        // --- Modified Section Start ---
        
        // Removed the previous restriction (where Cancelled bookings couldn't be updated)
        // Now any status can be updated to APPROVED.

        booking.setStatus(status);

        if (status == Booking.BookingStatus.REJECTED) {
            booking.setRejectionReason(reason);
        } 
        // Clear previous rejection reason when re-approving or setting to Pending
        else if (status == Booking.BookingStatus.APPROVED || status == Booking.BookingStatus.PENDING) {
            booking.setRejectionReason(null);
        }

        // --- Modified Section End ---
        
        Booking updatedBooking = bookingRepository.save(booking);

        // ✅ Notification Logic:
        String message = "Your booking for " + booking.getResourceId() + " has been " + status;
        if (status == Booking.BookingStatus.REJECTED && reason != null) {
            message += ". Reason: " + reason;
        }
        notificationService.createNotification(booking.getUserEmail(), message, "BOOKING", id);

        return updatedBooking;
    }

    @Override
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found. ID: " + id));
    }

    @Override
    public void cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));
        
        if(booking.getStatus() == Booking.BookingStatus.REJECTED) {
            throw new RuntimeException("Cannot cancel a booking that has already been rejected.");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // ✅ Send notification upon cancellation
        notificationService.createNotification(
            booking.getUserEmail(), 
            "Booking for " + booking.getResourceId() + " was successfully CANCELLED.", 
            "BOOKING", 
            id
        );
    }
}