package com.example.skillswap.controller;

import com.example.skillswap.model.SkillSwapRequest;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.UserRepository;
import com.example.skillswap.service.SkillSwapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/swaps")
public class SkillSwapController {

    @Autowired
    private SkillSwapService swapService;

    @Autowired
    private UserRepository userRepo;

    // Send a skill swap request
    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(@RequestBody Map<String, String> body) {
        try {
            Long senderId = Long.parseLong(body.get("senderId"));
            Long recipientId = Long.parseLong(body.get("recipientId"));

            User sender = userRepo.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User recipient = userRepo.findById(recipientId)
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));

            String requestedSkill = body.get("requestedSkill");
            String desiredSkill = body.get("desiredSkill");
            String proposedDateTimeStr = body.get("proposedDateTime");
            String phoneNumber = body.get("phoneNumber");

            LocalDateTime proposedDateTime = parseDateTime(proposedDateTimeStr);

            SkillSwapRequest saved = swapService.sendSwapRequest(
                    sender.getId(),
                    recipient.getId(),
                    requestedSkill,
                    desiredSkill,
                    proposedDateTime,
                    phoneNumber);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "Failed to create swap request"));
        }
    }

    private LocalDateTime parseDateTime(String dtStr) {
        if (dtStr == null || dtStr.isBlank()) {
            return LocalDateTime.now().plusDays(1);
        }
        try {
            return LocalDateTime.parse(dtStr);
        } catch (Exception e1) {
            try {
                return LocalDateTime.parse(dtStr.replace(" ", "T"));
            } catch (Exception e2) {
                try {
                    return java.time.ZonedDateTime.parse(dtStr).toLocalDateTime();
                } catch (Exception e3) {
                    return LocalDateTime.now().plusDays(1);
                }
            }
        }
    }

    // Get incoming (pending) swap requests for a user
    @GetMapping("/pending/{userId}")
    public List<SkillSwapRequest> getIncomingRequests(@PathVariable Long userId) {
        User recipient = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return swapService.getSwapsForUser(recipient);
    }

    // Get outgoing swap requests sent by user
    @GetMapping("/sent/{userId}")
    public List<SkillSwapRequest> getSentRequests(@PathVariable Long userId) {
        User sender = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return swapService.getSentSwaps(sender);
    }

    // Update swap request status (accept/reject)
    @PatchMapping("/status/{swapId}")
    public SkillSwapRequest updateSwapStatus(@PathVariable Long swapId, @RequestParam String status) {
        return swapService.updateStatus(swapId, status);
    }
}