package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Frontend එක Vite (React) නිසා 5173 port එකට access දීලා තියෙන එක නිවැරදියි
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Local Registration Endpoint
     * මෙහි කිසිදු logic වෙනසක් සිදු කර නැත. 
     * UserService මගින් MongoDB වෙත දත්ත ගබඩා කිරීම සිදු කරනු ලබයි.
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerLocalUser(user));
    }
}