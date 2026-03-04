package com.smartcampus.backend.service;
import java.util.List;
import com.smartcampus.backend.dto.UserDTO;

public interface UserService {
    UserDTO saveUser(UserDTO userDTO);
    List<UserDTO> getAllUsers();
    void deleteUser(Long id);
}