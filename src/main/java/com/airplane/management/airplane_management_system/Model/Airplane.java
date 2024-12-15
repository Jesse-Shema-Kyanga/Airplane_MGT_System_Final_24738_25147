package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Airplane {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID airplaneId;

    private String model;
    private int capacity;
    private String manufacturer;
    private String makeNumber; // Unique identifier for testing and selection
    private LocalDate yearOfManufacture; // New field
    private LocalDate lastMaintenanceDate; // New field
    private LocalDate nextMaintenanceDate; // New field
    private int totalSeats = 180;  // Default value for standard configuration
    private int seatsPerRow = 6;   // Default value for common layout A-F



    @Enumerated(EnumType.STRING)
    private MaintenanceStatus maintenanceStatus;

    public enum MaintenanceStatus {
        GOOD, LIGHT_MAINTENANCE_REQUIRED, HEAVY_MAINTENANCE_REQUIRED, RETIRED // Added retired
    }

    private String operationalIssues; // New field to log issues

    // Default Constructor
    public Airplane() {}

    // Parameterized Constructor
    public Airplane(String model, String manufacturer, int capacity, String makeNumber,
                    LocalDate yearOfManufacture, LocalDate lastMaintenanceDate,
                    LocalDate nextMaintenanceDate, int totalSeats, int seatsPerRow) {
        this.model = model;
        this.capacity = capacity;
        this.manufacturer = manufacturer;
        this.makeNumber = makeNumber;
        this.yearOfManufacture = yearOfManufacture;
        this.lastMaintenanceDate = lastMaintenanceDate;
        this.nextMaintenanceDate = nextMaintenanceDate;
        this.maintenanceStatus = MaintenanceStatus.GOOD;
        this.totalSeats = totalSeats;
        this.seatsPerRow = seatsPerRow;
    }


    // Getters and Setters
    public UUID getAirplaneId() {
        return airplaneId;
    }

    public void setAirplaneId(UUID airplaneId) {
        this.airplaneId = airplaneId;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getMakeNumber() {
        return makeNumber;
    }

    public void setMakeNumber(String makeNumber) {
        this.makeNumber = makeNumber;
    }

    public LocalDate getYearOfManufacture() {
        return yearOfManufacture;
    }

    public void setYearOfManufacture(LocalDate yearOfManufacture) {
        this.yearOfManufacture = yearOfManufacture;
    }

    public LocalDate getLastMaintenanceDate() {
        return lastMaintenanceDate;
    }

    public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public LocalDate getNextMaintenanceDate() {
        return nextMaintenanceDate;
    }

    public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) {
        this.nextMaintenanceDate = nextMaintenanceDate;
    }

    public MaintenanceStatus getMaintenanceStatus() {
        return maintenanceStatus;
    }

    public void setMaintenanceStatus(MaintenanceStatus maintenanceStatus) {
        this.maintenanceStatus = maintenanceStatus;
    }

    public String getOperationalIssues() {
        return operationalIssues;
    }

    public void setOperationalIssues(String operationalIssues) {
        this.operationalIssues = operationalIssues;
    }
    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getSeatsPerRow() {
        return seatsPerRow;
    }

    public void setSeatsPerRow(int seatsPerRow) {
        this.seatsPerRow = seatsPerRow;
    }


}
