package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository; // JPA වෙනුවට MongoDB Repository
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> { // ID type එක String කළා
    
    // Email එක මගින් පරිශීලකයා සෙවීමට (Login සඳහා) - MongoDB වලත් මේක මේ විදියටම වැඩ කරනවා
    Optional<User> findByEmail(String email);

    // Email එක දැනටමත් පද්ධතියේ තිබේදැයි බැලීමට (Registration validation සඳහා)
    Boolean existsByEmail(String email);
    
    // අවශ්‍ය නම් provider අනුව පරිශීලකයන් සෙවීමට
    // List<User> findByProvider(String provider);
}