package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    // පරිශීලකයාට තමන්ගේම වෙන් කිරීම් බැලීමට (Module B requirement) [cite: 65]
    List<Booking> findByUserEmail(String userEmail);

    // යම් සම්පතකට අදාළ සියලුම වෙන් කිරීම් බැලීමට
    List<Booking> findByResourceId(String resourceId);

    /**
     * කාල පරාසයන් ගැටෙනවාදැයි පරීක්ෂා කරන Query එක (Conflict Checking logic).
     * මෙහිදී පරීක්ෂා කරන්නේ:
     * 1. එකම Resource එක විය යුතුයි.
     * 2. පවතින Booking එක CANCELLED හෝ REJECTED නොවිය යුතුයි.
     * 3. ඇතුළත් කරන වේලාව පවතින වෙනත් Booking එකක වේලාවන් සමඟ Overlap නොවිය යුතුයි.
     */
    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "  $or: [ " +
           "    { 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } } " +
           "  ] " +
           "}")
    List<Booking> findOverlappingBookings(String resourceId, LocalDateTime start, LocalDateTime end);
}