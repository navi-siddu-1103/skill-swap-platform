package com.example.skillswap.controller;

import com.example.skillswap.model.Skill;
import com.example.skillswap.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SkillRepository skillRepository;

    // Search users by skill name and type ("teach" or "learn")
    @GetMapping
    public List<Map<String, Object>> searchUsersBySkill(
            @RequestParam String skill,
            @RequestParam String type) {
        String cleanSkill = (skill != null) ? skill.trim() : "";
        String cleanType = (type != null) ? type.trim() : "teach";

        List<Skill> skills = skillRepository.findByNameContainingIgnoreCaseAndTypeIgnoreCase(cleanSkill, cleanType);

        // Extract distinct users and return clean DTO maps to prevent LazyInitializationException and avoid password exposure
        Map<Long, Map<String, Object>> uniqueUsers = new LinkedHashMap<>();
        for (Skill s : skills) {
            if (s.getUser() != null && !uniqueUsers.containsKey(s.getUser().getId())) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", s.getUser().getId());
                map.put("username", s.getUser().getUsername());
                map.put("email", s.getUser().getEmail());
                map.put("role", s.getUser().getRole());
                uniqueUsers.put(s.getUser().getId(), map);
            }
        }
        return new ArrayList<>(uniqueUsers.values());
    }
}
