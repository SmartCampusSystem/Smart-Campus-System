package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import java.util.List;

public interface BookingService {
    // පරිශීලකයින් සඳහා
    Booking createBooking(Booking booking);
    List<Booking> getMyBookings(String email);
    void cancelBooking(String id);

    // Admin සඳහා
    List<Booking> getAllBookings();
    Booking updateBookingStatus(String id, Booking.BookingStatus status, String reason);
}