package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(Booking booking) {
        // 1. කාල පරාසයන් ගැටෙනවාදැයි පරීක්ෂා කිරීම
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                booking.getResourceId(), 
                booking.getStartTime(), 
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("මෙම වේලාව තුළ මෙම සම්පත දැනටමත් වෙන්කර ඇත.");
        }

        // 2. අලුත් Booking එකක් සැමවිටම PENDING විය යුතුයි
        booking.setStatus(Booking.BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getMyBookings(String email) {
        // අලුත්ම වෙන් කිරීම් ලැයිස්තුවේ ඉහළටම එන ලෙස සකසා එවනු ලැබේ
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
                .orElseThrow(() -> new RuntimeException("Booking එක හමු නොවීය."));
        
        // දැනටමත් CANCELLED කර ඇත්නම් එහි status එක වෙනස් කළ නොහැක
        if(booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("මෙම වෙන් කිරීම දැනටමත් අවලංගු කර ඇත.");
        }

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
        
        // දැනටමත් REJECTED හෝ CANCELLED නම් නැවත cancel කළ නොහැක
        if(booking.getStatus() == Booking.BookingStatus.REJECTED) {
            throw new RuntimeException("ප්‍රතික්ෂේප කළ වෙන් කිරීමක් අවලංගු කළ නොහැක.");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}