package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId; // Primary Key using UUID

    private String name;
    private String email;
    private String phone;
    private String password; // Login variable
    private String passportNumber;
    private LocalDate dateOfBirth;
    private String twoFactorCode;
    private LocalDateTime twoFactorCodeExpiry;


    @Enumerated(EnumType.STRING)
    private Role role;

    private String operationalIssues; // For roles that might have operational issues

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = true) // Ensure flight is nullable
    private Flight flight; // For crew members associated with a flight

    // Enum for user roles
    public enum Role {
        ADMIN,
        PILOT,
        COPILOT,
        FLIGHT_ATTENDANT,
        PASSENGER,
        MAINTENANCE_STAFF
    }

    // Default Constructor
    public User() {}

    // Parameterized Constructor
    public User(String name, String email, String phone, String password, String passportNumber, LocalDate dateOfBirth, Role role, String operationalIssues, Flight flight) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.passportNumber = passportNumber;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.operationalIssues = operationalIssues;
        this.flight = flight;
    }

    // Getters and Setters
    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getOperationalIssues() {
        return operationalIssues;
    }

    public void setOperationalIssues(String operationalIssues) {
        this.operationalIssues = operationalIssues;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
    public String getTwoFactorCode()
    { return twoFactorCode; }

    public void setTwoFactorCode(String twoFactorCode)
    { this.twoFactorCode = twoFactorCode; }
    public LocalDateTime getTwoFactorCodeExpiry()
    { return twoFactorCodeExpiry; }
    public void setTwoFactorCodeExpiry(LocalDateTime twoFactorCodeExpiry)
    { this.twoFactorCodeExpiry = twoFactorCodeExpiry;
    }
}
