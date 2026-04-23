package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.Ticket.TicketStatus;
import lombok.Data;

@Data
public class StatusUpdateDTO {

    private TicketStatus status;
    private String resolutionNote;   // Required when status = RESOLVED
    private String rejectionReason;  // Required when status = REJECTED
}