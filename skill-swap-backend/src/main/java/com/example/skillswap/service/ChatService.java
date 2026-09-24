package com.example.skillswap.service;

import com.example.skillswap.model.ChatMessage;
import com.example.skillswap.model.User;
import com.example.skillswap.repository.ChatMessageRepository;
import com.example.skillswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Persist a new message and return the saved entity.
     */
    public ChatMessage saveMessage(Long senderId, Long receiverId, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setSenderId(senderId);
        msg.setReceiverId(receiverId);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setRead(false);
        return chatMessageRepository.save(msg);
    }

    /**
     * Retrieve all messages exchanged between two users, oldest first.
     */
    public List<ChatMessage> getConversation(Long userId1, Long userId2) {
        return chatMessageRepository.findConversation(userId1, userId2);
    }

    /**
     * Count unread messages waiting for a user.
     */
    public long countUnread(Long receiverId) {
        return chatMessageRepository.findByReceiverIdAndReadFalse(receiverId).size();
    }

    /**
     * Mark all messages from `senderId` to `receiverId` as read.
     */
    public void markAsRead(Long senderId, Long receiverId) {
        List<ChatMessage> unread = chatMessageRepository.findByReceiverIdAndReadFalse(receiverId);
        unread.stream()
              .filter(m -> m.getSenderId().equals(senderId))
              .forEach(m -> {
                  m.setRead(true);
                  chatMessageRepository.save(m);
              });
    }

    /**
     * All user IDs that the given user has ever chatted with.
     */
    public List<Long> getContactIds(Long userId) {
        return chatMessageRepository.findContactIds(userId);
    }

    /**
     * Returns a summary of all conversations for the inbox popup:
     * partner info, last message preview, and unread count.
     */
    public List<Map<String, Object>> getConversations(Long userId) {
        List<Long> contactIds = chatMessageRepository.findContactIds(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Long contactId : contactIds) {
            Optional<User> userOpt = userRepository.findById(contactId);
            if (userOpt.isEmpty()) continue;

            User contact = userOpt.get();
            List<ChatMessage> history = chatMessageRepository.findConversation(userId, contactId);

            long unread = history.stream()
                    .filter(m -> m.getReceiverId().equals(userId) && !m.isRead())
                    .count();

            String lastMessage = history.isEmpty()
                    ? ""
                    : history.get(history.size() - 1).getContent();

            Map<String, Object> conv = new LinkedHashMap<>();
            conv.put("userId",      contactId);
            conv.put("username",    contact.getUsername());
            conv.put("lastMessage", lastMessage);
            conv.put("unreadCount", unread);
            result.add(conv);
        }

        // Sort: conversations with unread messages appear first
        result.sort((a, b) -> Long.compare(
                (Long) b.get("unreadCount"),
                (Long) a.get("unreadCount")));

        return result;
    }
}
