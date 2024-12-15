package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {
    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    @Autowired
    private PilotRepository pilotRepository;

    @Autowired
    private FlightAttendantRepository flightAttendantRepository;

    @Autowired
    private TicketRepository ticketRepository;

    // Method to create flight
    public Flight createFlight(String flightNumber, String departureLocation, String arrivalLocation, LocalDateTime departureTime, LocalDateTime arrivalTime, UUID airplaneId, Flight.FlightStatus status) {
        Airplane airplane = airplaneRepository.findById(airplaneId).orElse(null);
        if (airplane != null) {
            Flight flight = new Flight(flightNumber, departureLocation, arrivalLocation, departureTime, arrivalTime, airplane, status);
            return flightRepository.save(flight);
        }
        return null;
    }

    // Method to update flight details
    public Flight updateFlight(UUID flightId, String flightNumber, String departureLocation, String arrivalLocation, LocalDateTime departureTime, LocalDateTime arrivalTime, UUID airplaneId, Flight.FlightStatus status) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        Airplane airplane = airplaneRepository.findById(airplaneId).orElse(null);

        if (flight != null && airplane != null) {
            flight.setFlightNumber(flightNumber);
            flight.setDepartureLocation(departureLocation);
            flight.setArrivalLocation(arrivalLocation);
            flight.setDepartureTime(departureTime);
            flight.setArrivalTime(arrivalTime);
            flight.setAirplane(airplane);
            flight.setStatus(status);
            return flightRepository.save(flight);
        }
        return null;
    }

    // Assign pilot to flight
    public Pilot assignPilot(UUID pilotId, UUID flightId) {
        Pilot pilot = pilotRepository.findById(pilotId).orElse(null);
        Flight flight = flightRepository.findById(flightId).orElse(null);

        if (pilot != null && flight != null) {
            pilot.setFlight(flight);
            return pilotRepository.save(pilot);
        }
        return null;
    }

    // Assign flight attendant to flight
    public FlightAttendant assignFlightAttendant(UUID flightAttendantId, UUID flightId) {
        FlightAttendant flightAttendant = flightAttendantRepository.findById(flightAttendantId).orElse(null);
        Flight flight = flightRepository.findById(flightId).orElse(null);

        if (flightAttendant != null && flight != null) {
            flightAttendant.setFlight(flight);
            return flightAttendantRepository.save(flightAttendant);
        }
        return null;
    }

    // Set maintenance status of airplane
    public Airplane setMaintenanceStatus(UUID airplaneId, Airplane.MaintenanceStatus status) {
        Airplane airplane = airplaneRepository.findById(airplaneId).orElse(null);
        if (airplane != null) {
            airplane.setMaintenanceStatus(status);
            return airplaneRepository.save(airplane);
        }
        return null;
    }

    // Get ticket sales report
    public List<Ticket> getTicketSalesReport() {
        return ticketRepository.findAll();
    }
}
