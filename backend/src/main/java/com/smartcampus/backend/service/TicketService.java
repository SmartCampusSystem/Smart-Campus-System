package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.model.Ticket.TicketStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {

    // ── CRUD ────────────────────────────────────────────────────────────────
    TicketResponseDTO create(TicketRequestDTO request, String creatorEmail, String creatorName);

    TicketResponseDTO getById(String id);

    List<TicketResponseDTO> getAll();

    List<TicketResponseDTO> getMyTickets(String creatorEmail);

    List<TicketResponseDTO> getByStatus(TicketStatus status);

    List<TicketResponseDTO> getByTechnician(String technicianEmail);

    List<Object> getWeeklyDataByTechnician(String technicianEmail);

    TicketResponseDTO update(String id, TicketRequestDTO request, String requesterEmail);

    void delete(String id, String requesterEmail);

    // ── WORKFLOW ─────────────────────────────────────────────────────────────
    /**
     * Admin / Technician updates ticket status.
     * Validates allowed transitions and enforces notes on RESOLVED/REJECTED.
     */
    TicketResponseDTO updateStatus(String id, StatusUpdateDTO dto, String requesterEmail);

    /**
     * Admin assigns (or reassigns) a technician to the ticket.
     */
    TicketResponseDTO assignTechnician(String id, String technicianEmail, String requesterEmail);

    // ── ATTACHMENTS ──────────────────────────────────────────────────────────
    /**
     * Upload up to 3 image attachments. Throws if limit already reached.
     */
    TicketResponseDTO addAttachments(String id, MultipartFile[] files, String uploaderEmail);

    /**
     * Remove a single attachment by its ID.
     */
    TicketResponseDTO deleteAttachment(String ticketId, String attachmentId, String requesterEmail);

    // ── COMMENTS ─────────────────────────────────────────────────────────────
    TicketResponseDTO addComment(String ticketId, CommentDTO commentDTO, String authorEmail, String authorName);

    TicketResponseDTO editComment(String ticketId, String commentId, String newText, String requesterEmail);

    TicketResponseDTO deleteComment(String ticketId, String commentId, String requesterEmail);
}