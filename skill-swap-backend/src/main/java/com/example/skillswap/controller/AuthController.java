package com.example.skillswap.controller;

import com.example.skillswap.model.User;
import com.example.skillswap.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Inject encoder bean

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = userService.registerUser(
                    body.get("username"),
                    body.get("password"),
                    "USER",
                    body.get("email"));
            return ResponseEntity.ok(Map.of(
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "role", user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String identifier = body.get("username");
        String password = body.get("password");

        if (identifier == null || identifier.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("message", "Please enter both username/email and password"));
        }

        identifier = identifier.trim();

        // Support login by either username or email (case-insensitive)
        Optional<User> userOpt = userService.findByUsernameOrEmail(identifier);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedPassword = user.getPassword();
            boolean matches = false;

            // 1. Check BCrypt match (with trim fallback for mobile keyboards)
            try {
                matches = passwordEncoder.matches(password, storedPassword);
                if (!matches && !password.equals(password.trim())) {
                    matches = passwordEncoder.matches(password.trim(), storedPassword);
                }
            } catch (Exception ignored) {
            }

            // 2. Fallback: plain text match (if saved before BCrypt or unhashed)
            if (!matches && storedPassword != null && (storedPassword.equals(password) || storedPassword.equals(password.trim()))) {
                matches = true;
                user.setPassword(passwordEncoder.encode(password));
                userService.save(user);
            }

            if (matches) {
                return ResponseEntity.ok(
                        Map.of(
                                "userId", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "role", user.getRole() != null ? user.getRole() : "USER"));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
    }
}
