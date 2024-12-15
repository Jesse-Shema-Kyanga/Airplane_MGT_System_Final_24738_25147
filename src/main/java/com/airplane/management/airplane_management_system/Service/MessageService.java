package com.airplane.management.airplane_management_system.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airplane.management.airplane_management_system.Model.Message;
import com.airplane.management.airplane_management_system.Repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(String messageContent, String senderName) {
        Message message = new Message(messageContent, senderName);
        return messageRepository.save(message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(UUID id) {
        return messageRepository.findById(id);
    }

    public Message updateMessage(UUID id, String newMessageContent) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setMessage(newMessageContent);
        return messageRepository.save(message);
    }

    public void deleteMessage(UUID id) {
        messageRepository.deleteById(id);
    }

    public long countAllMessages() {
        return messageRepository.count(); 
    }
    
}
