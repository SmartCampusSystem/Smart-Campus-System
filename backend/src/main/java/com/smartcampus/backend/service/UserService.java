package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;

// Member 4: Local Login වැඩ කිරීමට UserDetailsService අනිවාර්ය වේ
public interface UserService extends UserDetailsService {
    
    // --- OAuth 2.0 Methods ---
    UserDTO processOAuthPostLogin(String email, String name, String picture, String providerId);
    
    // --- Local Authentication Methods (Member 4 Task) ---
    UserDTO registerLocalUser(User user); 
    
    // Login වීමේදී විස්තර ලබා ගැනීමට
    UserDTO getUserByEmail(String email);

    // --- User Management Methods ---
    // Long id වෙනුවට String id භාවිතා කරන ලදී (MongoDB ගැලපුම සඳහා)
    UserDTO getUserById(String id);
    
    List<UserDTO> getAllUsers();
    
    UserDTO updateUserRole(String id, String role);
    
    void deleteUser(String id);
}