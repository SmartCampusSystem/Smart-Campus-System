package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.model.Ticket.TicketStatus;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * Member 3 – Module C: Incident Ticket Management
 *
 * Endpoints:
 *  POST   /api/tickets                             → Create ticket
 *  GET    /api/tickets                             → Get all (Admin/Technician)
 *  GET    /api/tickets/my                          → Get own tickets
 *  GET    /api/tickets/{id}                        → Get by ID
 *  PUT    /api/tickets/{id}                        → Update ticket details (creator only)
 *  DELETE /api/tickets/{id}                        → Delete ticket
 *  PUT    /api/tickets/{id}/status                 → Update status (Admin/Technician)
 *  PUT    /api/tickets/{id}/assign                 → Assign technician (Admin)
 *  POST   /api/tickets/{id}/attachments            → Upload images (max 3)
 *  DELETE /api/tickets/{id}/attachments/{aId}      → Remove attachment
 *  GET    /api/tickets/filter?status=&priority=    → Filter tickets
 *  POST   /api/tickets/{id}/comments               → Add comment
 *  PUT    /api/tickets/{id}/comments/{cId}         → Edit own comment
 *  DELETE /api/tickets/{id}/comments/{cId}         → Delete own comment
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    // ─── Resolve logged-in user's email ────────────────────────────────────
    private String resolveEmail(Authentication auth) {
        if (auth == null) return null;
        if (auth.getPrincipal() instanceof OAuth2User oauth) {
            return oauth.getAttribute("email");
        }
        return auth.getName();
    }

    private String resolveName(Authentication auth) {
        if (auth == null) return "Unknown";
        
        String email = resolveEmail(auth);
        if (email == null) return "Unknown";
        
        // Try to get user from database to get their actual name
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.getName() != null && !user.getName().trim().isEmpty()) {
            return user.getName();
        }
        
        // Fallback to OAuth2 name if available
        if (auth.getPrincipal() instanceof OAuth2User oauth) {
            String name = oauth.getAttribute("name");
            if (name != null) return name;
        }
        
        return "Unknown User";
    }

    // ─────────────────────────────────────────────────────────────────────
    // 1. CREATE TICKET   POST /api/tickets
    // ─────────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO request,
                                          Authentication auth) {
        try {
            System.out.println("Creating ticket with request: " + request);
            
            String email = resolveEmail(auth);
            String name = resolveName(auth);
            
            // If no authentication, try to get a default user from database
            if (email == null) {
                // Try to find a default user (first USER role user)
                User defaultUser = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.USER)
                    .findFirst()
                    .orElse(null);
                
                if (defaultUser != null) {
                    email = defaultUser.getEmail();
                    name = defaultUser.getName();
                } else {
                    // Fallback to test values if no user found
                    email = "test.user@example.com";
                    name = "Test User";
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ticketService.create(request, email, name));
        } catch (Exception e) {
            System.err.println("Error creating ticket: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create ticket: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 2. GET ALL TICKETS   GET /api/tickets
    // ─────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAll());
    }

    // ─────────────────────────────────────────────────────────────────────
    // 3. GET MY TICKETS   GET /api/tickets/my
    // ─────────────────────────────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<?> getMyTickets(Authentication auth) {
        String email = resolveEmail(auth);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    // ─────────────────────────────────────────────────────────────────────
    // 4. FILTER TICKETS   GET /api/tickets/filter?status=&priority=
    // ─────────────────────────────────────────────────────────────────────
    @GetMapping("/filter")
    public ResponseEntity<?> filterTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String priority) {
        if (status != null) return ResponseEntity.ok(ticketService.getByStatus(status));
        return ResponseEntity.ok(ticketService.getAll());
    }

    // ─────────────────────────────────────────────────────────────────────
    // 5. GET BY ID   GET /api/tickets/{id}
    // ─────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getById(id));
    }

    // ─────────────────────────────────────────────────────────────────────
    // 6. UPDATE TICKET DETAILS   PUT /api/tickets/{id}
    // ─────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable String id,
                                          @RequestBody TicketRequestDTO request,
                                          Authentication auth) {
        String email = resolveEmail(auth);
        
        // Require authentication
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        }
        
        // Fetch real user data from database
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        
        // Check if user has USER role (or higher)
        if (user.getRole() != Role.USER && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN && user.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. User role required.");
        }
        
        try {
            return ResponseEntity.ok(ticketService.update(id, request, email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 7. DELETE TICKET   DELETE /api/tickets/{id}
    // ─────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id, Authentication auth) {
        String email = resolveEmail(auth);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        ticketService.delete(id, email);
        return ResponseEntity.noContent().build();
    }

    // ─────────────────────────────────────────────────────────────────────
    // 8. UPDATE STATUS   PUT /api/tickets/{id}/status
    // ─────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                          @RequestBody StatusUpdateDTO dto,
                                          Authentication auth) {
        String email = resolveEmail(auth);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        try {
            return ResponseEntity.ok(ticketService.updateStatus(id, dto, email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 9. ASSIGN TECHNICIAN   PUT /api/tickets/{id}/assign
    // ─────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTechnician(@PathVariable String id,
                                              @RequestBody Map<String, String> body,
                                              Authentication auth) {
        String email = resolveEmail(auth);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        String technicianEmail = body.get("technicianEmail");
        if (technicianEmail == null || technicianEmail.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "technicianEmail is required."));
        try {
            return ResponseEntity.ok(ticketService.assignTechnician(id, technicianEmail, email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 10. UPLOAD ATTACHMENTS   POST /api/tickets/{id}/attachments
    // ─────────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/attachments")
    public ResponseEntity<?> uploadAttachments(@PathVariable String id,
                                               @RequestParam("files") MultipartFile[] files,
                                               Authentication auth) {
        String email = resolveEmail(auth);
        
        // Require authentication
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        }
        
        // Fetch real user data from database
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        
        // Check if user has USER role (or higher)
        if (user.getRole() != Role.USER && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN && user.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. User role required.");
        }
        
        if (files == null || files.length == 0)
            return ResponseEntity.badRequest().body(Map.of("error", "No files provided."));
        try {
            return ResponseEntity.ok(ticketService.addAttachments(id, files, email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 11. DELETE ATTACHMENT   DELETE /api/tickets/{id}/attachments/{attachmentId}
    // ─────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable String id,
                                              @PathVariable String attachmentId,
                                              Authentication auth) {
        String email = resolveEmail(auth);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        return ResponseEntity.ok(ticketService.deleteAttachment(id, attachmentId, email));
    }

    // ─────────────────────────────────────────────────────────────────────
    // 12. ADD COMMENT   POST /api/tickets/{id}/comments
    // ─────────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable String id,
                                        @RequestBody CommentDTO commentDTO,
                                        Authentication auth) {
        try {
            String email = resolveEmail(auth);
            String name = resolveName(auth);
            
            // If no authentication, try to get a default user from database
            if (email == null) {
                // Try to find a default user (first USER role user)
                User defaultUser = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.USER)
                    .findFirst()
                    .orElse(null);
                
                if (defaultUser != null) {
                    email = defaultUser.getEmail();
                    name = defaultUser.getName();
                } else {
                    // Fallback to test values if no user found
                    email = "test.user@example.com";
                    name = "Test User";
                }
            }
            
            return ResponseEntity.ok(ticketService.addComment(id, commentDTO, email, name));
        } catch (Exception e) {
            System.err.println("Error adding comment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add comment: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 13. EDIT COMMENT   PUT /api/tickets/{id}/comments/{commentId}
    // ─────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> editComment(@PathVariable String id,
                                         @PathVariable String commentId,
                                         @RequestBody Map<String, String> body,
                                         Authentication auth) {
        String email = resolveEmail(auth);
        
        // Require authentication
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        }
        
        // Fetch real user data from database
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        
        // Check if user has USER role (or higher)
        if (user.getRole() != Role.USER && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN && user.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. User role required.");
        }
        
        String newText = body.get("text");
        if (newText == null || newText.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Comment text cannot be empty."));
        try {
            return ResponseEntity.ok(ticketService.editComment(id, commentId, newText, email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 14. DELETE COMMENT   DELETE /api/tickets/{id}/comments/{commentId}
    // ─────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String id,
                                           @PathVariable String commentId,
                                           Authentication auth) {
        String email = resolveEmail(auth);
        
        // Require authentication
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        }
        
        // Fetch real user data from database
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        
        // Check if user has USER role (or higher)
        if (user.getRole() != Role.USER && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN && user.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. User role required.");
        }
        
        try {
            return ResponseEntity.ok(ticketService.deleteComment(id, commentId, email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // 15. GET TECHNICIANS   GET /api/tickets/technicians
    // ─────────────────────────────────────────────────────────────────────
    @GetMapping("/technicians")
    public ResponseEntity<?> getTechnicians(Authentication auth) {
        String email = resolveEmail(auth);
        
        // Require authentication
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required.");
        }
        
        // Fetch real user data from database
        User user = userRepository.findByEmail(email)
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }
        
        // Check if user has USER role (or higher)
        if (user.getRole() != Role.USER && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN && user.getRole() != Role.MANAGER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. User role required.");
        }
        
        try {
            List<User> technicians = userRepository.findByRole(Role.TECHNICIAN);
            return ResponseEntity.ok(technicians);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch technicians"));
        }
    }
}