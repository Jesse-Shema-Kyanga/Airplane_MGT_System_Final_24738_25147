package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FlightService {
    @Autowired
    private SeatService seatService;
    @Autowired
    private FlightRepository flightRepository;
    @Autowired
    private AirplaneRepository airplaneRepository;
    @Autowired
    private PilotRepository pilotRepository;
    @Autowired
    private FlightAttendantRepository flightAttendantRepository;

    public String createFlightWithMakeNumber(Flight flight, String makeNumber) {
        Airplane airplane = airplaneRepository.findByMakeNumber(makeNumber);
        if (airplane != null) {
            flight.setAirplane(airplane);
            flightRepository.save(flight);
            return "Flight created successfully!";
        }
        return "Failed to create flight: Airplane with makeNumber " + makeNumber + " not found.";
    }

    public Flight updateFlightDetails(UUID flightId, Flight flightDetails, String makeNumber) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        Airplane airplane = airplaneRepository.findByMakeNumber(makeNumber);

        if (flight != null && airplane != null) {
            flight.setFlightNumber(flightDetails.getFlightNumber());
            flight.setDepartureLocation(flightDetails.getDepartureLocation());
            flight.setArrivalLocation(flightDetails.getArrivalLocation());
            flight.setDepartureTime(flightDetails.getDepartureTime());
            flight.setArrivalTime(flightDetails.getArrivalTime());
            flight.setAirplane(airplane);
            flight.setStatus(flightDetails.getStatus());
            flight.setPrice(flightDetails.getPrice());
            return flightRepository.save(flight);
        }
        return null;
    }

    public Flight setFlightStatus(UUID flightId, Flight.FlightStatus status) {
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight != null) {
            flight.setStatus(status);
            return flightRepository.save(flight);
        }
        return null;
    }

    public List<Flight> viewAssignedFlights(Pilot pilot) {
        return flightRepository.findByPilotsContains(pilot);
    }

    public List<Flight> viewAssignedFlights(FlightAttendant flightAttendant) {
        return flightRepository.findByFlightAttendantsContains(flightAttendant);
    }

    public Flight getFlight(UUID flightId) {
        return flightRepository.findById(flightId).orElse(null);
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Page<Flight> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable);
    }

    public void deleteFlight(UUID flightId) {
        flightRepository.deleteById(flightId);
    }

    public List<Flight> searchFlights(String departureLocation, String arrivalLocation,
                                      LocalDateTime startTime, LocalDateTime endTime) {
        return flightRepository.findByDepartureLocationAndArrivalLocationAndDepartureTimeBetween(
                departureLocation, arrivalLocation, startTime, endTime);
    }

    private List<String> generateAllPossibleSeats(int totalSeats, int seatsPerRow) {
        List<String> seats = new ArrayList<>();
        int rows = totalSeats / seatsPerRow;
        char[] rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < seatsPerRow; j++) {
                seats.add(rowLetters[i] + String.valueOf(j + 1));
            }
        }
        return seats;
    }

    public boolean validateSeatNumber(String seatNumber, int totalSeats, int seatsPerRow) {
        if (seatNumber == null || seatNumber.length() < 2) return false;

        char row = seatNumber.charAt(0);
        String number = seatNumber.substring(1);

        try {
            int seatNum = Integer.parseInt(number);
            return row >= 'A' && row <= 'Z' &&
                    seatNum > 0 &&
                    seatNum <= seatsPerRow;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public Long countFlightsToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        return flightRepository.countFlightsToday(startOfDay, endOfDay);
    }
}
