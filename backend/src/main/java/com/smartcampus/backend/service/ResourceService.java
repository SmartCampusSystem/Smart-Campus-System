package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import java.util.List;

public interface ResourceService {
    Resource addResource(Resource resource);
    List<Resource> getAllResources();
    Resource getResourceById(String id);
    List<Resource> filterResources(String type, Integer capacity, String location);
    Resource updateResource(String id, Resource resource);
    void deleteResource(String id);
}