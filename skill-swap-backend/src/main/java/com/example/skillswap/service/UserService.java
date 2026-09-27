package com.example.skillswap.service;

import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User registerUser(String username, String password, String role, String email) {
        String cleanUser = username != null ? username.trim() : "";
        String cleanEmail = email != null ? email.trim() : "";

        if (userRepo.findByUsernameIgnoreCase(cleanUser).isPresent())
            throw new RuntimeException("Username already taken");

        if (!cleanEmail.isEmpty() && userRepo.findByEmailIgnoreCase(cleanEmail).isPresent())
            throw new RuntimeException("Email already registered");

        User user = new User();
        user.setUsername(cleanUser);
        user.setPassword(encoder.encode(password));
        user.setRole(role != null ? role : "USER");
        user.setEmail(cleanEmail);
        return userRepo.save(user);
    }

    public Optional<User> findByUsername(String username) {
        if (username == null || username.isBlank()) return Optional.empty();
        String clean = username.trim();
        Optional<User> u = userRepo.findByUsernameIgnoreCase(clean);
        if (u.isPresent()) return u;
        return userRepo.findByUsername(clean);
    }

    public Optional<User> findByUsernameOrEmail(String identifier) {
        if (identifier == null || identifier.isBlank()) return Optional.empty();
        String clean = identifier.trim();

        // 1. Try username case-insensitive
        Optional<User> user = userRepo.findByUsernameIgnoreCase(clean);
        if (user.isPresent()) return user;

        // 2. Try email case-insensitive
        user = userRepo.findByEmailIgnoreCase(clean);
        if (user.isPresent()) return user;

        // 3. Fallback exact matches
        user = userRepo.findByUsername(clean);
        if (user.isPresent()) return user;

        return userRepo.findByEmail(clean);
    }

    public User save(User user) {
        return userRepo.save(user);
    }
}
