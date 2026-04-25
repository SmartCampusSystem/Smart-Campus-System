package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository; // JPA වෙනුවට MongoDB Repository
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> { // ID type එක String කළා
    
    
    Optional<User> findByEmail(String email);


    Boolean existsByEmail(String email);
    
  
    List<User> findByRole(Role role);
    
}