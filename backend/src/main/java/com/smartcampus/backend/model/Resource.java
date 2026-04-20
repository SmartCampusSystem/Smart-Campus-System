package com.smartcampus.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "resources") // MongoDB collection නම
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    private String id; // MongoDB සාමාන්‍යයෙන් String ID භාවිතා කරයි

    private String name;
    private String type; // Module A metadata [cite: 53]
    private Integer capacity;
    private String location;
    private String availabilityWindows;
    private ResourceStatus status; // ACTIVE / OUT_OF_SERVICE [cite: 53]
    private String createdBy;

    public enum ResourceStatus {
        ACTIVE, OUT_OF_SERVICE
    }
}