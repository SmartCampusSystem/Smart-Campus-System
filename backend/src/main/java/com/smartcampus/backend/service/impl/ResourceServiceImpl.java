package com.smartcampus.backend.service.impl;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    @Override
    public List<Resource> filterResources(String type, Integer capacity, String location) {
        if (type != null && !type.isEmpty()) return resourceRepository.findByType(type);
        if (capacity != null) return resourceRepository.findByCapacityGreaterThanEqual(capacity);
        if (location != null && !location.isEmpty()) return resourceRepository.findByLocationContainingIgnoreCase(location);
        return resourceRepository.findAll();
    }

    @Override
    public Resource updateResource(String id, Resource resourceDetails) {
        // 1. පවතින Resource එක ලබා ගැනීම
        Resource resource = getResourceById(id);
        
        // 2. සියලුම Fields යාවත්කාලීන කිරීම (Update all relevant fields)
        resource.setName(resourceDetails.getName());
        resource.setType(resourceDetails.getType());
        resource.setCapacity(resourceDetails.getCapacity());
        resource.setLocation(resourceDetails.getLocation());
        resource.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
        resource.setStatus(resourceDetails.getStatus());
        
        // සටහන: createdBy වෙනස් නොකර තබා ගැනීම නිර්දේශ කෙරේ (Auditability සඳහා)

        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(String id) {
        // මකා දැමීමට පෙර පවතීදැයි පරීක්ෂා කිරීම වඩාත් සුදුසුයි
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}