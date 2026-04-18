package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 1. GET /me - දැනට ලොග් වී සිටින පරිශීලකයා ලබා ගැනීම (OAuth සහ Local දෙකටම)
     * Rubric Requirement: Proper session management
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email;
        // Google OAuth හරහා ලොග් වී ඇත්නම්
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            email = oAuth2User.getAttribute("email");
        } 
        // Local Login හරහා ලොග් වී ඇත්නම් (Spring Security Principal)
        else {
            email = authentication.getName();
        }

        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * අලුතින් එකතු කළ කොටස: GET /by-email?email=...
     * Frontend එකේ login එකෙන් පසු Role එක දැන ගැනීමට මෙය භාවිතා කරයි.
     */
    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam("email") String email) {
        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // 2. GET - සියලුම පරිශීලකයන් ලබා ගැනීම (Admin පමණි)
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // 3. GET - ID එක මගින් සෙවීම
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 4. PUT - User Role වෙනස් කිරීම (Admin පමණි)
    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long id, @RequestBody String role) {
        String cleanRole = role.replace("\"", "").trim(); 
        return ResponseEntity.ok(userService.updateUserRole(id, cleanRole));
    }

    // 5. DELETE - පරිශීලකයෙකු ඉවත් කිරීම
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}