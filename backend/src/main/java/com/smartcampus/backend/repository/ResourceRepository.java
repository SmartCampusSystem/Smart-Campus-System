package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    // Module A අවශ්‍යතාවය: Type අනුව search කිරීම [cite: 54]
    List<Resource> findByType(String type);
    
    // Module A අවශ්‍යතාවය: Capacity අනුව search කිරීම [cite: 54]
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
    
    // Module A අවශ්‍යතාවය: Location අනුව search කිරීම [cite: 54]
    List<Resource> findByLocationContainingIgnoreCase(String location);
}