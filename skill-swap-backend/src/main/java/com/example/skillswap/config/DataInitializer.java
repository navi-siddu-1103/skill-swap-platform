package com.example.skillswap.config;

import com.example.skillswap.model.Skill;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.SkillRepository;
import com.example.skillswap.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains users. Skipping initial seed.");
            return;
        }

        log.info("Seeding initial community users and skills for fresh database...");

        createUserWithSkills(
                "Naveen",
                "naveen@gmail.com",
                "Naveen123",
                List.of(
                        new String[]{"Java", "teach"},
                        new String[]{"Spring Boot", "teach"},
                        new String[]{"React", "teach"},
                        new String[]{"Hibernate", "teach"},
                        new String[]{"Python", "learn"},
                        new String[]{"AIML", "learn"}
                )
        );

        createUserWithSkills(
                "Manoj",
                "manoj@gmail.com",
                "Manoj123",
                List.of(
                        new String[]{"RAG", "teach"},
                        new String[]{"Gen AI", "teach"},
                        new String[]{"Python", "teach"},
                        new String[]{"Java", "learn"},
                        new String[]{"Spring Boot", "learn"}
                )
        );

        createUserWithSkills(
                "Priya",
                "priya@gmail.com",
                "Priya123",
                List.of(
                        new String[]{"UI/UX Design", "teach"},
                        new String[]{"Figma", "teach"},
                        new String[]{"CSS", "teach"},
                        new String[]{"React", "learn"},
                        new String[]{"JavaScript", "learn"}
                )
        );

        createUserWithSkills(
                "Rahul",
                "rahul@gmail.com",
                "Rahul123",
                List.of(
                        new String[]{"Machine Learning", "teach"},
                        new String[]{"Python", "teach"},
                        new String[]{"Data Science", "teach"},
                        new String[]{"Docker", "learn"},
                        new String[]{"Cloud Architecture", "learn"}
                )
        );

        createUserWithSkills(
                "Ananya",
                "ananya@gmail.com",
                "Ananya123",
                List.of(
                        new String[]{"Cloud Architecture", "teach"},
                        new String[]{"AWS", "teach"},
                        new String[]{"DevOps", "teach"},
                        new String[]{"Kubernetes", "learn"},
                        new String[]{"Java", "learn"}
                )
        );

        log.info("Community users and skills verified successfully!");
    }

    private void createUserWithSkills(String username, String email, String rawPassword, List<String[]> skills) {
        if (userRepository.findByUsername(username).isPresent()) {
            return;
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole("USER");
        User savedUser = userRepository.save(user);

        for (String[] s : skills) {
            Skill skill = new Skill();
            skill.setName(s[0]);
            skill.setType(s[1]);
            skill.setUser(savedUser);
            skillRepository.save(skill);
        }
    }
}
