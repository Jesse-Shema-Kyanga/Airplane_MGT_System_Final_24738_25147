package com.airplane.management.airplane_management_system.Repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airplane.management.airplane_management_system.Model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    long count();
    
}
