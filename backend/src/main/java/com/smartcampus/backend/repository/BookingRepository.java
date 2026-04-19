package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByResourceId(String resourceId);

    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "  $or: [ " +
           "    { 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } } " +
           "  ] " +
           "}")
    List<Booking> findOverlappingBookings(String resourceId, LocalDateTime start, LocalDateTime end);
}