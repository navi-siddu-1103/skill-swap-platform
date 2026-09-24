package com.example.skillswap.controller;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    /**
     * WebSocket handler — clients publish to /app/chat.send
     * Payload: { senderId, receiverId, content }
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload Map<String, Object> payload) {
        Long senderId   = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content  = payload.get("content").toString();

        ChatMessage saved = chatService.saveMessage(senderId, receiverId, content);

        // ✅ Only push to RECEIVER — sender already sees message via optimistic UI.
        // Echoing back to sender was causing duplicate messages.
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(), "/queue/messages", saved);
    }

    // ── REST endpoints ──────────────────────────────────────────────────────

    /** Fetch conversation history between two users */
    @GetMapping("/history/{userId1}/{userId2}")
    public List<ChatMessage> getHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        return chatService.getConversation(userId1, userId2);
    }

    /** Count unread messages for the logged-in user */
    @GetMapping("/unread/count/{userId}")
    public Map<String, Long> getUnreadCount(@PathVariable Long userId) {
        return Map.of("count", chatService.countUnread(userId));
    }

    /** Mark all messages from sender → receiver as read */
    @PostMapping("/read/{senderId}/{receiverId}")
    public void markAsRead(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        chatService.markAsRead(senderId, receiverId);
    }

    /** Get list of user IDs this user has chatted with */
    @GetMapping("/contacts/{userId}")
    public List<Long> getContacts(@PathVariable Long userId) {
        return chatService.getContactIds(userId);
    }

    /** Get inbox summary — all conversations with partner info, last message, unread count */
    @GetMapping("/conversations/{userId}")
    public List<Map<String, Object>> getConversations(@PathVariable Long userId) {
        return chatService.getConversations(userId);
    }
}
