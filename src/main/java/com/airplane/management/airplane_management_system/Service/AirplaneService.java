package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.Airplane;
import com.airplane.management.airplane_management_system.Repository.AirplaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AirplaneService {
    @Autowired
    private AirplaneRepository airplaneRepository;

    public Airplane save(Airplane airplane) {
        return airplaneRepository.save(airplane);
    }

    // Delete an airplane by ID
    public void delete(UUID airplaneId) {
        Optional<Airplane> airplane = airplaneRepository.findById(airplaneId);
        if (airplane.isPresent()) {
            airplaneRepository.delete(airplane.get());
        } else {
            throw new RuntimeException("Airplane not found");
        }
    }

    // Update an airplane's details
    public Airplane updateAirplane(UUID airplaneId, Airplane airplaneDetails) {
        Optional<Airplane> existingAirplaneOpt = airplaneRepository.findById(airplaneId);

        if (existingAirplaneOpt.isPresent()) {
            Airplane existingAirplane = existingAirplaneOpt.get();

            // Update fields of the existing airplane
            existingAirplane.setModel(airplaneDetails.getModel());
            existingAirplane.setManufacturer(airplaneDetails.getManufacturer());
            existingAirplane.setCapacity(airplaneDetails.getCapacity());
            existingAirplane.setMakeNumber(airplaneDetails.getMakeNumber());
            existingAirplane.setYearOfManufacture(airplaneDetails.getYearOfManufacture());
            existingAirplane.setLastMaintenanceDate(airplaneDetails.getLastMaintenanceDate());
            existingAirplane.setNextMaintenanceDate(airplaneDetails.getNextMaintenanceDate());
            existingAirplane.setMaintenanceStatus(airplaneDetails.getMaintenanceStatus());
            existingAirplane.setOperationalIssues(airplaneDetails.getOperationalIssues());
            existingAirplane.setTotalSeats(airplaneDetails.getTotalSeats());
            existingAirplane.setSeatsPerRow(airplaneDetails.getSeatsPerRow());

            return airplaneRepository.save(existingAirplane); // Save and return the updated airplane
        } else {
            throw new RuntimeException("Airplane not found with id: " + airplaneId);
        }
    }

    // Fetch all airplanes
    public Page<Airplane> getAllAirplanes(Pageable pageable) {
        return airplaneRepository.findAll(pageable);
    }

    // Find an airplane by ID
    public Airplane getAirplaneById(UUID airplaneId) {
        return airplaneRepository.findById(airplaneId).orElse(null);
    }

    // // Find airplanes by maintenance status
    // public List<Airplane> getAirplanesByMaintenanceStatus(Airplane.MaintenanceStatus maintenanceStatus) {
    //     return airplaneRepository.findByMaintenanceStatus(maintenanceStatus);
    // }

    public Long countTotalAirplanes() {
        return airplaneRepository.countTotalAirplanes();
    }


    //get airplane by status
    public List<Airplane> getAllGoodStatusAirplanes() {
        return airplaneRepository.findByMaintenanceStatus();
    }





}
