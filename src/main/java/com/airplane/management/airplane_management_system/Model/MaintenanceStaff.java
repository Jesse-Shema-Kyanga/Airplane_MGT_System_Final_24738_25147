package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class MaintenanceStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID staffId;

    private String name;
    private String phoneNumber;
    private String email; // Changed from emailAddress to email to match the repository method
    private String password; // Login variable
    private LocalDate dateOfBirth; // New field
    private int yearsOfExperience; // New field
    private String certifications; // New field

    @Enumerated(EnumType.STRING)
    private Status status; // New enum field for status

    private String operationalIssues; // Added field for operational issues

    public enum Status {
        ACTIVE, ON_LEAVE, RETIRED
    }

    // Default Constructor
    public MaintenanceStaff() {}

    // Parameterized Constructor
    public MaintenanceStaff(String name, String phoneNumber, String email, String password, LocalDate dateOfBirth, int yearsOfExperience, String certifications, Status status, String operationalIssues) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.yearsOfExperience = yearsOfExperience;
        this.certifications = certifications;
        this.status = status;
        this.operationalIssues = operationalIssues;
    }

    // Getters and Setters
    public UUID getStaffId() {
        return staffId;
    }

    public void setStaffId(UUID staffId) {
        this.staffId = staffId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getOperationalIssues() {
        return operationalIssues;
    }

    public void setOperationalIssues(String operationalIssues) {
        this.operationalIssues = operationalIssues;
    }
}
