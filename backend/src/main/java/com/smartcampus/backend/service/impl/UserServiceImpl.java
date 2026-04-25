package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword() != null ? user.getPassword() : "") // Google users ලට password නැති නිසා
                .roles(user.getRole().name())
                .build();
    }

    // 1. OAuth 2.0 Registration/Login
    @Override
    public UserDTO processOAuthPostLogin(String email, String name, String picture, String providerId) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPicture(picture);
            newUser.setProviderId(providerId);
            newUser.setProvider("GOOGLE");

            String lowerEmail = email.toLowerCase();
            if (lowerEmail.endsWith("@admin.smartcampus.com")) {
                newUser.setRole(Role.ADMIN);
            } else if (lowerEmail.endsWith("@tech.smartcampus.com")) {
                newUser.setRole(Role.TECHNICIAN);
            } else {
                newUser.setRole(Role.USER);
            }

            return userRepository.save(newUser);
        });
        return mapToDTO(user);
    }

    // 2. Local Registration
    @Override
    public UserDTO registerLocalUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setProvider("LOCAL");

        String lowerEmail = user.getEmail().toLowerCase();
        if (lowerEmail.endsWith("@admin.smartcampus.com")) {
            user.setRole(Role.ADMIN);
        } else if (lowerEmail.endsWith("@tech.smartcampus.com")) {
            user.setRole(Role.TECHNICIAN);
        } else {
            user.setRole(Role.USER);
        }
        
        return mapToDTO(userRepository.save(user));
    }

  
    @Override
    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

   
    @Override
    public UserDTO updateUserRole(String id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(role.toUpperCase()));
        return mapToDTO(userRepository.save(user));
    }

   
    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId()); 
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPicture(user.getPicture());
        dto.setRole(user.getRole().name());
        dto.setProvider(user.getProvider());
        dto.setCreatedAt(user.getCreatedAt()); 
        return dto;
    }
}