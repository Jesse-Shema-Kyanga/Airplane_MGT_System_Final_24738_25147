package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID adminId;
    private String username;
    private String password;
    private String name;
    private String email;
    private String phoneNumber; // New field for phone number
    private LocalDate dateOfBirth; // New field for date of birth

    // Default Constructor
    public Admin() {}

    // Parameterized Constructor
    public Admin(String username, String password, String name, String email, String phoneNumber, LocalDate dateOfBirth) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
    }

    // Getters and Setters
    public UUID getAdminId() {
        return adminId;
    }

    public void setAdminId(UUID adminId) {
        this.adminId = adminId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}
