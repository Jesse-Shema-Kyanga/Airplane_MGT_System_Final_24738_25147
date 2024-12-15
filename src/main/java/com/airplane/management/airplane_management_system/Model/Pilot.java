package com.airplane.management.airplane_management_system.Model;

import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Pilot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID pilotId;

    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String licenseNumber;
    private String licenseType;
    private int yearsOfExperience;
    private String phone;
    private String email;

    @Enumerated(EnumType.STRING)
    private Status status;



    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = true) // Ensure flight is nullable
    private Flight flight; // Foreign Key to Flight

    public enum Status {
        ACTIVE, ON_LEAVE, INACTIVE
    }

    // Default Constructor
    public Pilot() {}

    // Parameterized Constructor
    public Pilot(String name, LocalDate dateOfBirth, String licenseNumber, String licenseType, int yearsOfExperience, String phone, String email, Status status, Flight flight) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.licenseNumber = licenseNumber;
        this.licenseType = licenseType;
        this.yearsOfExperience = yearsOfExperience;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.flight = flight;
    }

    // Getters and Setters
    public UUID getPilotId() {
        return pilotId;
    }

    public void setPilotId(UUID pilotId) {
        this.pilotId = pilotId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(String licenseType) {
        this.licenseType = licenseType;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}

