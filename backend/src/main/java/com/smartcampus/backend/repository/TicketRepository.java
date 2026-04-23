package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.Ticket.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    // Find all tickets created by a specific user
    List<Ticket> findByCreatorEmail(String creatorEmail);

    // Find all tickets assigned to a technician
    List<Ticket> findByAssignedTechnician(String technicianEmail);

    // Find tickets by status (Admin filtering)
    List<Ticket> findByStatus(TicketStatus status);

    // Find tickets by priority
    List<Ticket> findByPriority(String priority);

    // Find tickets linked to a specific resource
    List<Ticket> findByResourceId(String resourceId);

    // Find tickets by category
    List<Ticket> findByCategory(String category);
}