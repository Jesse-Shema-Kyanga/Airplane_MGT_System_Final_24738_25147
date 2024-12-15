package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID passengerId; // Primary Key using UUID

    private String name;
    private String email;
    private String phone;
    private String password; // Login variable
    private String passportNumber;
    private LocalDate dateOfBirth;

    // Default Constructor
    public Passenger() {}

    // Parameterized Constructor
    public Passenger(String name, String email, String phone, String password, String passportNumber, LocalDate dateOfBirth) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password; // Initialize password
        this.passportNumber = passportNumber;
        this.dateOfBirth = dateOfBirth;
    }

    // Getters and Setters
    public UUID getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(UUID passengerId) {
        this.passengerId = passengerId;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
}
