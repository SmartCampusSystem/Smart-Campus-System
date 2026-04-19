package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking) {
        // 1. කාල පරාසයන් ගැටෙනවාදැයි පරීක්ෂා කිරීම (Conflict Checking - Requirement )
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("මෙම වේලාව තුළ මෙම සම්පත දැනටමත් වෙන්කර ඇත (Scheduling Conflict).");
        }

        // 2. මුලින්ම Booking එකක් දමන විට එය PENDING විය යුතුයි 
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getMyBookings(String email) {
        return bookingRepository.findByUserEmail(email); // 
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll(); // Admin සඳහා 
    }

    @Override
    public Booking updateBookingStatus(String id, Booking.BookingStatus status, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking එක හමු නොවීය."));
        
        // Admin හට Approve හෝ Reject කළ හැක 
        booking.setStatus(status);
        if (status == Booking.BookingStatus.REJECTED) {
            booking.setRejectionReason(reason);
        }
        
        return bookingRepository.save(booking);
    }

    @Override
    public void cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking එක හමු නොවීය."));
        
        // Approved වෙන් කිරීම් පසුව අවලංගු කළ හැක 
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}