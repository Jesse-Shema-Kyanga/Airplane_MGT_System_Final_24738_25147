package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID flightId;
    private double price;


    private String flightNumber;
    private String departureLocation;
    private String arrivalLocation;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    @ManyToOne
    @JoinColumn(name = "airplane_id", nullable = false)
    private Airplane airplane; // Foreign Key to Airplane

    @Enumerated(EnumType.STRING)
    private FlightStatus status;

    public Flight(String flightNumber, String departureLocation, String arrivalLocation,
                  LocalDateTime departureTime, LocalDateTime arrivalTime, Airplane airplane,
                  FlightStatus status) {
        this.flightNumber = flightNumber;
        this.departureLocation = departureLocation;
        this.arrivalLocation = arrivalLocation;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.airplane = airplane;
        this.status = status;
        this.pilots = new ArrayList<>(); // Initialize with empty list
        this.flightAttendants = new ArrayList<>(); // Initialize with empty list
    }

    public enum FlightStatus {
        SCHEDULED, DELAYED, CANCELLED, LANDING
    }

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<Pilot> pilots; // List of Pilots

    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
    private List<FlightAttendant> flightAttendants; // List of Flight Attendants

    // Default Constructor
    public Flight() {}

    // Parameterized Constructor
    public Flight(String flightNumber, String departureLocation, String arrivalLocation,
                  LocalDateTime departureTime, LocalDateTime arrivalTime, Airplane airplane,
                  FlightStatus status, double price) {  // Add price parameter
        this.flightNumber = flightNumber;
        this.departureLocation = departureLocation;
        this.arrivalLocation = arrivalLocation;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.airplane = airplane;
        this.status = status;
        this.price = price;  // Set price
        this.pilots = new ArrayList<>();
        this.flightAttendants = new ArrayList<>();
    }

    // Getters and Setters
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
    public UUID getFlightId() {
        return flightId;
    }

    public void setFlightId(UUID flightId) {
        this.flightId = flightId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getDepartureLocation() {
        return departureLocation;
    }

    public void setDepartureLocation(String departureLocation) {
        this.departureLocation = departureLocation;
    }

    public String getArrivalLocation() {
        return arrivalLocation;
    }

    public void setArrivalLocation(String arrivalLocation) {
        this.arrivalLocation = arrivalLocation;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Airplane getAirplane() {
        return airplane;
    }

    public void setAirplane(Airplane airplane) {
        this.airplane = airplane;
    }

    public FlightStatus getStatus() {
        return status;
    }

    public void setStatus(FlightStatus status) {
        this.status = status;
    }

    public List<Pilot> getPilots() {
        return pilots;
    }

    public void setPilots(List<Pilot> pilots) {
        this.pilots = pilots;
    }

    public List<FlightAttendant> getFlightAttendants() {
        return flightAttendants;
    }

    public void setFlightAttendants(List<FlightAttendant> flightAttendants) {
        this.flightAttendants = flightAttendants;
    }
}
