package com.airplane.management.airplane_management_system.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.Pilot;
import com.airplane.management.airplane_management_system.Repository.FlightRepository;
import com.airplane.management.airplane_management_system.Repository.PilotRepository;

@Service
public class PilotService {
    @Autowired
    private PilotRepository pilotRepository;

    @Autowired
    private FlightRepository flightRepository;

    public List<Flight> viewAssignedFlights(UUID pilotId) {
        Pilot pilot = pilotRepository.findById(pilotId).orElse(null);
        if (pilot != null) {
            return flightRepository.findByPilotsContains(pilot);
        }
        return List.of();
    }

    public Pilot assignFlight(UUID pilotId, UUID flightId) {
        Pilot pilot = pilotRepository.findById(pilotId).orElse(null);
        Flight flight = flightRepository.findById(flightId).orElse(null);

        if (pilot != null && flight != null) {
            pilot.setFlight(flight);
            return pilotRepository.save(pilot);
        }
        return null;
    }

    public Pilot save(Pilot pilot) {
        return pilotRepository.save(pilot);
    }

    public void delete(UUID pilotId) {
        Optional<Pilot> pilot = pilotRepository.findById(pilotId);
        if (pilot.isPresent()) {
            pilotRepository.delete(pilot.get());
        } else {
            throw new RuntimeException("Pilot not found");
        }
    }

    public Pilot updatePilot(UUID pilotId, Pilot pilotDetails) {
        Optional<Pilot> existingPilotOpt = pilotRepository.findById(pilotId);

        if (existingPilotOpt.isPresent()) {
            Pilot existingPilot = existingPilotOpt.get();

            existingPilot.setName(pilotDetails.getName());
            existingPilot.setDateOfBirth(pilotDetails.getDateOfBirth());
            existingPilot.setLicenseNumber(pilotDetails.getLicenseNumber());
            existingPilot.setLicenseType(pilotDetails.getLicenseType());
            existingPilot.setYearsOfExperience(pilotDetails.getYearsOfExperience());
            existingPilot.setPhone(pilotDetails.getPhone());
            existingPilot.setEmail(pilotDetails.getEmail());
            existingPilot.setStatus(pilotDetails.getStatus());

            return pilotRepository.save(existingPilot);
        } else {
            throw new RuntimeException("Pilot not found with id: " + pilotId);
        }
    }

    public Page<Pilot> getAllPilots(Pageable pageable) {
        return pilotRepository.findAll(pageable);
    }

    public Long countActivePilots() {
        return pilotRepository.countActivePilots();
    }

    public List<Pilot> getSeniorActivePilots() {
        return pilotRepository.findSeniorActivePilots();
    }

    public List<Pilot> getJuniorActivePilots() {
        return pilotRepository.findJuniorActivePilots();
    }
}
