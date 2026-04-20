package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // 1. අලුත් සම්පතක් ඇතුළත් කිරීම (Create)
    // Principal භාවිතා කර Login වී සිටින පරිශීලකයාගේ විස්තර ලබා ගනී
    @PostMapping
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource, Principal principal) {
        if (principal != null) {
            resource.setCreatedBy(principal.getName()); // Login වුණු කෙනාගේ Email එක/Username එක දානවා
        }
        return ResponseEntity.ok(resourceService.addResource(resource));
    }

    // 2. සියලුම සම්පත් ලබා ගැනීම (Read All)
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // 3. ID එක අනුව සම්පතක් ලබා ගැනීම (Read by ID)
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // 4. Filter කිරීම (Search functionality for Module A)
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> filterResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(resourceService.filterResources(type, capacity, location));
    }

    // 5. සම්පතක විස්තර යාවත්කාලීන කිරීම (Update)
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resource, Principal principal) {
        if (principal != null) {
            // Update කරන විට අවසානයට වෙනස් කළ පුද්ගලයා සටහන් කර ගැනීමටත් පුළුවන්
            // resource.setUpdatedBy(principal.getName()); 
        }
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    // 6. සම්පතක් ඉවත් කිරීම (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}