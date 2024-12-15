package com.airplane.management.airplane_management_system.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.FlightAttendant;
import com.airplane.management.airplane_management_system.Repository.FlightAttendantRepository;
import com.airplane.management.airplane_management_system.Repository.FlightRepository;

@Service
public class FlightAttendantService {
    @Autowired
    private FlightAttendantRepository flightAttendantRepository;

    @Autowired
    private FlightRepository flightRepository;

    public List<Flight> viewAssignedFlights(UUID flightAttendantId) {
        FlightAttendant flightAttendant = flightAttendantRepository.findById(flightAttendantId).orElse(null);
        if (flightAttendant != null) {
            return flightRepository.findByFlightAttendantsContains(flightAttendant);
        }
        return List.of();
    }

    public FlightAttendant assignFlight(UUID flightAttendantId, UUID flightId) {
        FlightAttendant flightAttendant = flightAttendantRepository.findById(flightAttendantId).orElse(null);
        Flight flight = flightRepository.findById(flightId).orElse(null);

        if (flightAttendant != null && flight != null) {
            flightAttendant.setFlight(flight);
            return flightAttendantRepository.save(flightAttendant);
        }
        return null;
    }

    public FlightAttendant save(FlightAttendant flightAttendant) {
        return flightAttendantRepository.save(flightAttendant);
    }

    public void delete(UUID flightAttendantId) {
        Optional<FlightAttendant> flightAttendant = flightAttendantRepository.findById(flightAttendantId);
        if (flightAttendant.isPresent()) {
            flightAttendantRepository.delete(flightAttendant.get());
        } else {
            throw new RuntimeException("Flight Attendant not found");
        }
    }

    public FlightAttendant updateFlightAttendant(UUID flightAttendantId, FlightAttendant flightAttendantDetails) {
        Optional<FlightAttendant> existingFlightAttendantOpt = flightAttendantRepository.findById(flightAttendantId);

        if (existingFlightAttendantOpt.isPresent()) {
            FlightAttendant existingFlightAttendant = existingFlightAttendantOpt.get();

            existingFlightAttendant.setName(flightAttendantDetails.getName());
            existingFlightAttendant.setDateOfBirth(flightAttendantDetails.getDateOfBirth());
            existingFlightAttendant.setYearsOfExperience(flightAttendantDetails.getYearsOfExperience());
            existingFlightAttendant.setPhone(flightAttendantDetails.getPhone());
            existingFlightAttendant.setEmail(flightAttendantDetails.getEmail());
            existingFlightAttendant.setStatus(flightAttendantDetails.getStatus());

            return flightAttendantRepository.save(existingFlightAttendant);
        } else {
            throw new RuntimeException("Flight Attendant not found with id: " + flightAttendantId);
        }
    }

    public Page<FlightAttendant> getAllFlightAttendants(Pageable pageable) {
        return flightAttendantRepository.findAll(pageable);
    }

    public Long countActiveFlightAttendants() {
        return flightAttendantRepository.countActiveFlightAttendants();
    }

    public List<FlightAttendant> getJuniorActiveAttendants() {
        return flightAttendantRepository.findJuniorActiveAttendants();
    }

    public List<FlightAttendant> getMidLevelActiveAttendants() {
        return flightAttendantRepository.findMidLevelActiveAttendants();
    }

    public List<FlightAttendant> getSeniorActiveAttendants() {
        return flightAttendantRepository.findSeniorActiveAttendants();
    }
}
