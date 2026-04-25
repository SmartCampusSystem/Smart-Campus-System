package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;


public interface UserService extends UserDetailsService {
    
  
    UserDTO processOAuthPostLogin(String email, String name, String picture, String providerId);
    
   
    UserDTO registerLocalUser(User user); 
    
  
    UserDTO getUserByEmail(String email);

   
    UserDTO getUserById(String id);
    
    List<UserDTO> getAllUsers();
    
    UserDTO updateUserRole(String id, String role);
    
    void deleteUser(String id);
}