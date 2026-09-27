package com.example.skillswap.controller;

import com.example.skillswap.model.Skill;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.SkillRepository;
import com.example.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserRepository userRepository;

    // Search users by skill name and type ("teach", "learn", or "all")
    @GetMapping
    public List<Map<String, Object>> searchUsersBySkill(
            @RequestParam(required = false, defaultValue = "") String skill,
            @RequestParam(required = false, defaultValue = "all") String type) {

        String cleanSkill = (skill != null) ? skill.trim() : "";
        String cleanType = (type != null) ? type.trim().toLowerCase() : "all";

        List<Skill> matchingSkills;

        if (cleanSkill.isEmpty()) {
            if ("all".equals(cleanType)) {
                matchingSkills = skillRepository.findAll();
            } else {
                matchingSkills = skillRepository.findByTypeIgnoreCase(cleanType);
            }
        } else {
            if ("all".equals(cleanType)) {
                matchingSkills = skillRepository.findByNameContainingIgnoreCase(cleanSkill);
            } else {
                matchingSkills = skillRepository.findByNameContainingIgnoreCaseAndTypeIgnoreCase(cleanSkill, cleanType);
            }
        }

        // Map users and collect their skills (both teach & learn)
        Map<Long, Map<String, Object>> uniqueUsers = new LinkedHashMap<>();

        for (Skill s : matchingSkills) {
            User u = s.getUser();
            if (u != null && !uniqueUsers.containsKey(u.getId())) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", u.getId());
                map.put("username", u.getUsername());
                map.put("email", u.getEmail());
                map.put("role", u.getRole());

                // Fetch all skills for this user to display on their card
                List<Skill> userSkills = skillRepository.findByUserId(u.getId());
                List<String> teachList = new ArrayList<>();
                List<String> learnList = new ArrayList<>();

                for (Skill us : userSkills) {
                    if ("teach".equalsIgnoreCase(us.getType())) {
                        teachList.add(us.getName());
                    } else {
                        learnList.add(us.getName());
                    }
                }

                map.put("teachSkills", teachList);
                map.put("learnSkills", learnList);
                uniqueUsers.put(u.getId(), map);
            }
        }

        // If no skills matched but there are users in the system, and cleanSkill was empty, return all users
        if (cleanSkill.isEmpty() && uniqueUsers.isEmpty()) {
            List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", u.getId());
                map.put("username", u.getUsername());
                map.put("email", u.getEmail());
                map.put("role", u.getRole());

                List<Skill> userSkills = skillRepository.findByUserId(u.getId());
                List<String> teachList = new ArrayList<>();
                List<String> learnList = new ArrayList<>();
                for (Skill us : userSkills) {
                    if ("teach".equalsIgnoreCase(us.getType())) {
                        teachList.add(us.getName());
                    } else {
                        learnList.add(us.getName());
                    }
                }
                map.put("teachSkills", teachList);
                map.put("learnSkills", learnList);
                uniqueUsers.put(u.getId(), map);
            }
        }

        return new ArrayList<>(uniqueUsers.values());
    }
}
