package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class FlightAttendant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID flightAttendantId;

    private String name;
    private LocalDate dateOfBirth;
    private int yearsOfExperience;
    private String phone;
    private String email;
    private String password;  // Login variable
    @Enumerated(EnumType.STRING)
    private Status status;

    private String operationalIssues;  // Added field for operational issues

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = true) // Ensure flight is nullable
    private Flight flight; // Foreign Key to Flight

    public enum Status {
        ACTIVE, ON_LEAVE, RETIRED
    }

    // Default Constructor
    public FlightAttendant() {}

    // Parameterized Constructor
    public FlightAttendant(String name, LocalDate dateOfBirth, int yearsOfExperience, String phone, String email, String password, Status status, String operationalIssues, Flight flight) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.yearsOfExperience = yearsOfExperience;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.status = status;
        this.operationalIssues = operationalIssues;
        this.flight = flight;
    }

    // Getters and Setters
    public UUID getFlightAttendantId() {
        return flightAttendantId;
    }

    public void setFlightAttendantId(UUID flightAttendantId) {
        this.flightAttendantId = flightAttendantId;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}
