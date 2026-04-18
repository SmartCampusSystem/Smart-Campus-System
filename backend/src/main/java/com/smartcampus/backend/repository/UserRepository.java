package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Email එක මගින් පරිශීලකයා සෙවීමට (Login සඳහා)
    Optional<User> findByEmail(String email);

    // Email එක දැනටමත් පද්ධතියේ තිබේදැයි බැලීමට (Registration validation සඳහා)
    Boolean existsByEmail(String email);
    
    // අවශ්‍ය නම් provider අනුව පරිශීලකයන් සෙවීමට
    // List<User> findByProvider(String provider);
}