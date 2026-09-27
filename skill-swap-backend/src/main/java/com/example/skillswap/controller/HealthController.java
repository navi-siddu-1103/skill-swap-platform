package com.example.skillswap.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Health check controller.
 * Replaces the Spring Boot Whitelabel Error Page at the root URL.
 * Also useful for UptimeRobot / external monitoring pings.
 */
@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> root() {
        return buildResponse();
    }

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return buildResponse();
    }

    private Map<String, Object> buildResponse() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "Skill Swap API");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Backend is running successfully 🚀");
        return response;
    }
}
