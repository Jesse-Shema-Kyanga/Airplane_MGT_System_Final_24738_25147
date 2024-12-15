package com.airplane.management.airplane_management_system.Model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String message;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    public Message() {
        // Default constructor
    }

    public Message(String message, String senderName) {
        this.message = message;
        this.senderName = senderName;
        this.sentAt = LocalDateTime.now();
    }


    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

}
