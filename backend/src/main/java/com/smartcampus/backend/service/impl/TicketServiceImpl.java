package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.model.Attachment;
import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.Ticket.TicketStatus;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.service.FileStorageService;
import com.smartcampus.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FileStorageService fileStorageService;

    private static final int MAX_ATTACHMENTS = 3;

    // ═══════════════════════════════════════════════════════════
    // CRUD
    // ═══════════════════════════════════════════════════════════

    @Override
    public TicketResponseDTO create(TicketRequestDTO request, String creatorEmail, String creatorName) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setResourceId(request.getResourceId());
        
        // Structured Location Fields
        ticket.setBuildingName(request.getBuildingName());
        ticket.setFloor(request.getFloor());
        ticket.setBlock(request.getBlock());
        ticket.setRoomNumber(request.getRoomNumber());
        ticket.setLocation(request.getLocation());
        
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setCreatorEmail(creatorEmail);
        ticket.setCreatorName(creatorName);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setComments(new ArrayList<>());
        ticket.setAttachments(new ArrayList<>());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO getById(String id) {
        return mapToDTO(findTicketOrThrow(id));
    }

    @Override
    public List<TicketResponseDTO> getAll() {
        return ticketRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDTO> getMyTickets(String creatorEmail) {
        return ticketRepository.findByCreatorEmail(creatorEmail).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDTO> getByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponseDTO> getByTechnician(String technicianEmail) {
        return ticketRepository.findByAssignedTechnician(technicianEmail).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponseDTO update(String id, TicketRequestDTO request, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(id);
        if (!ticket.getCreatorEmail().equals(requesterEmail)) {
            throw new RuntimeException("Permission denied: you did not create this ticket.");
        }
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED) {
            throw new RuntimeException("Cannot edit a ticket that is CLOSED or REJECTED.");
        }
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setResourceId(request.getResourceId());
        
        // Structured Location Fields
        ticket.setBuildingName(request.getBuildingName());
        ticket.setFloor(request.getFloor());
        ticket.setBlock(request.getBlock());
        ticket.setRoomNumber(request.getRoomNumber());
        ticket.setLocation(request.getLocation());
        
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public void delete(String id, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(id);
        if (ticket.getAttachments() != null) {
            ticket.getAttachments().forEach(a -> {
                if (a.getStoredFilename() != null) fileStorageService.delete(a.getStoredFilename());
            });
        }
        ticketRepository.deleteById(id);
    }

    // ═══════════════════════════════════════════════════════════
    // WORKFLOW
    // ═══════════════════════════════════════════════════════════

    @Override
    public TicketResponseDTO updateStatus(String id, StatusUpdateDTO dto, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(id);
        validateTransition(ticket.getStatus(), dto.getStatus());
        if (dto.getStatus() == TicketStatus.RESOLVED) {
            if (dto.getResolutionNote() == null || dto.getResolutionNote().isBlank())
                throw new RuntimeException("A resolution note is required when resolving a ticket.");
            ticket.setResolutionNote(dto.getResolutionNote());
        }
        if (dto.getStatus() == TicketStatus.REJECTED) {
            if (dto.getRejectionReason() == null || dto.getRejectionReason().isBlank())
                throw new RuntimeException("A rejection reason is required when rejecting a ticket.");
            ticket.setRejectionReason(dto.getRejectionReason());
        }
        ticket.setStatus(dto.getStatus());
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO assignTechnician(String id, String technicianEmail, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(id);
        if (ticket.getStatus() == TicketStatus.CLOSED || ticket.getStatus() == TicketStatus.REJECTED)
            throw new RuntimeException("Cannot assign a technician to a CLOSED or REJECTED ticket.");
        ticket.setAssignedTechnician(technicianEmail);
        if (ticket.getStatus() == TicketStatus.OPEN) ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    // ═══════════════════════════════════════════════════════════
    // ATTACHMENTS
    // ═══════════════════════════════════════════════════════════

    @Override
    public TicketResponseDTO addAttachments(String id, MultipartFile[] files, String uploaderEmail) {
        Ticket ticket = findTicketOrThrow(id);
        if (ticket.getAttachments() == null) ticket.setAttachments(new ArrayList<>());
        int current = ticket.getAttachments().size();
        if (current >= MAX_ATTACHMENTS)
            throw new RuntimeException("Maximum of " + MAX_ATTACHMENTS + " attachments allowed per ticket.");
        if (files.length + current > MAX_ATTACHMENTS)
            throw new RuntimeException("Adding " + files.length + " file(s) would exceed the limit of " + MAX_ATTACHMENTS + ".");
        for (MultipartFile file : files) {
            try {
                ticket.getAttachments().add(fileStorageService.store(file));
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
            }
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO deleteAttachment(String ticketId, String attachmentId, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(ticketId);
        Attachment toRemove = ticket.getAttachments().stream()
                .filter(a -> a.getId().equals(attachmentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Attachment not found: " + attachmentId));
        if (toRemove.getStoredFilename() != null) fileStorageService.delete(toRemove.getStoredFilename());
        ticket.getAttachments().remove(toRemove);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    // ═══════════════════════════════════════════════════════════
    // COMMENTS
    // ═══════════════════════════════════════════════════════════

    @Override
    public TicketResponseDTO addComment(String ticketId, CommentDTO commentDTO, String authorEmail, String authorName) {
        Ticket ticket = findTicketOrThrow(ticketId);
        if (ticket.getComments() == null) ticket.setComments(new ArrayList<>());
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setText(commentDTO.getText());
        comment.setAuthorEmail(authorEmail);
        comment.setAuthorName(authorName);
        comment.setCreatedAt(LocalDateTime.now());
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO editComment(String ticketId, String commentId, String newText, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(ticketId);
        Comment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));
        if (!comment.getAuthorEmail().equals(requesterEmail))
            throw new RuntimeException("Permission denied: you cannot edit someone else's comment.");
        comment.setText(newText);
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO deleteComment(String ticketId, String commentId, String requesterEmail) {
        Ticket ticket = findTicketOrThrow(ticketId);
        Comment toRemove = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));
        if (!toRemove.getAuthorEmail().equals(requesterEmail))
            throw new RuntimeException("Permission denied: you cannot delete someone else's comment.");
        ticket.getComments().remove(toRemove);
        ticket.setUpdatedAt(LocalDateTime.now());
        return mapToDTO(ticketRepository.save(ticket));
    }

    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════

    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    private void validateTransition(TicketStatus current, TicketStatus next) {
        boolean valid = switch (current) {
            case OPEN        -> next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED    || next == TicketStatus.REJECTED;
            case RESOLVED    -> next == TicketStatus.CLOSED;
            case CLOSED, REJECTED -> false;
        };
        if (!valid) throw new RuntimeException("Invalid status transition: " + current + " -> " + next);
    }

    private TicketResponseDTO mapToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setCategory(ticket.getCategory());
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setResourceId(ticket.getResourceId());
        
        // Structured Location Fields
        dto.setBuildingName(ticket.getBuildingName());
        dto.setFloor(ticket.getFloor());
        dto.setBlock(ticket.getBlock());
        dto.setRoomNumber(ticket.getRoomNumber());
        dto.setLocation(ticket.getLocation());
        
        dto.setCreatorEmail(ticket.getCreatorEmail());
        dto.setCreatorName(ticket.getCreatorName());
        dto.setPreferredContact(ticket.getPreferredContact());
        dto.setAssignedTechnician(ticket.getAssignedTechnician());
        dto.setResolutionNote(ticket.getResolutionNote());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        if (ticket.getComments() != null) {
            dto.setComments(ticket.getComments().stream().map(c -> {
                CommentDTO cd = new CommentDTO();
                cd.setId(c.getId()); cd.setText(c.getText());
                cd.setAuthorEmail(c.getAuthorEmail()); cd.setAuthorName(c.getAuthorName());
                cd.setCreatedAt(c.getCreatedAt()); cd.setUpdatedAt(c.getUpdatedAt());
                return cd;
            }).collect(Collectors.toList()));
        }
        if (ticket.getAttachments() != null) {
            dto.setAttachments(ticket.getAttachments().stream().map(a -> {
                AttachmentDTO ad = new AttachmentDTO();
                ad.setId(a.getId()); ad.setFilename(a.getFilename());
                ad.setFileUrl(a.getFileUrl()); ad.setContentType(a.getContentType());
                ad.setFileSize(a.getFileSize());
                return ad;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}