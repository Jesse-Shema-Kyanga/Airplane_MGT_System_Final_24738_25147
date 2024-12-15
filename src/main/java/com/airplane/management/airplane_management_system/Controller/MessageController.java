package com.airplane.management.airplane_management_system.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airplane.management.airplane_management_system.Model.Message;
import com.airplane.management.airplane_management_system.Service.MessageService;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;


    @PostMapping(value = "/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message sentMessage = messageService.sendMessage(message.getMessage(), message.getSenderName());
        return ResponseEntity.ok(sentMessage);
    }

    @GetMapping(value ="/getAllMessages")
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable UUID id) {
        Optional<Message> message = messageService.getMessageById(id);
        return message.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Message> updateMessage(@PathVariable UUID id, @RequestBody String newMessageContent) {
        Message updatedMessage = messageService.updateMessage(id, newMessageContent);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/deleteMessage/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/count")
    public long getCountOfMessages() {
        return messageService.countAllMessages();
    }


    
}
