package com.smartcampus.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import java.io.File;

@SpringBootApplication
public class BackendApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	void init() {
		// Create upload directories if they don't exist
		new File("uploads/tickets").mkdirs();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Serve uploaded files
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations("file:uploads/");
	}

}
