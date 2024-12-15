package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdminRepository extends JpaRepository<Admin, UUID> {
    Optional<Admin> findByUsername(String username);
}
