package com.example.skillswap.repository;

import com.example.skillswap.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Fetch full conversation between two users, ordered by time.
     */
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderId = :a AND m.receiverId = :b) OR " +
           "(m.senderId = :b AND m.receiverId = :a) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("a") Long a, @Param("b") Long b);

    /**
     * All unread messages delivered to a receiver.
     */
    List<ChatMessage> findByReceiverIdAndReadFalse(Long receiverId);

    /**
     * List of all unique user IDs that have ever chatted with the given userId.
     * Uses a native query because JPQL doesn't support UNION.
     */
    @Query(value =
        "SELECT DISTINCT CASE WHEN sender_id = :userId THEN receiver_id ELSE sender_id END " +
        "FROM chat_messages WHERE sender_id = :userId OR receiver_id = :userId",
        nativeQuery = true)
    List<Long> findContactIds(@Param("userId") Long userId);
}
