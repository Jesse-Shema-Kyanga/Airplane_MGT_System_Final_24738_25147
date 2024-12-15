package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.Airplane;
import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.Ticket;
import com.airplane.management.airplane_management_system.Repository.FlightRepository;
import com.airplane.management.airplane_management_system.Repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SeatService {
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private FlightRepository flightRepository;

    public List<String> getOccupiedSeats(UUID flightId) {
        List<Ticket> tickets = ticketRepository.findByFlight_FlightId(flightId);
        return tickets.stream()
                .map(Ticket::getSeatNumber)
                .collect(Collectors.toList());
    }

    public List<String> getAvailableSeats(UUID flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getAirplane() == null) {
            return new ArrayList<>();
        }

        int totalSeats = flight.getAirplane().getTotalSeats();
        int seatsPerRow = flight.getAirplane().getSeatsPerRow();

        List<String> allSeats = generateAllPossibleSeats(totalSeats, seatsPerRow);
        List<String> occupiedSeats = getOccupiedSeats(flightId);
        allSeats.removeAll(occupiedSeats);

        return allSeats;
    }

    public boolean isSeatAvailable(UUID flightId, String seatNumber) {
        List<String> occupiedSeats = getOccupiedSeats(flightId);
        return !occupiedSeats.contains(seatNumber);
    }

    private List<String> generateAllPossibleSeats(int totalSeats, int seatsPerRow) {
        List<String> seats = new ArrayList<>();

        if (totalSeats <= 0 || seatsPerRow <= 0) {
            return seats;
        }

        int rows = (int) Math.ceil((double) totalSeats / seatsPerRow);
        char[] rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

        for (int i = 0; i < rows && i < rowLetters.length; i++) {
            for (int j = 0; j < seatsPerRow && (i * seatsPerRow + j) < totalSeats; j++) {
                seats.add(rowLetters[i] + String.valueOf(j + 1));
            }
        }
        return seats;
    }

    public boolean validateSeatNumber(String seatNumber, int totalSeats, int seatsPerRow) {
        // Print debug info
        System.out.println("Validating seat: " + seatNumber);
        System.out.println("Total seats: " + totalSeats);
        System.out.println("Seats per row: " + seatsPerRow);

        // Check for valid configuration
        if (totalSeats <= 0 || seatsPerRow <= 0) {
            return false;
        }

        // Basic format check (e.g., "A1", "B2", etc.)
        if (!seatNumber.matches("^[A-Z][0-9]+$")) {
            return false;
        }

        char row = seatNumber.charAt(0);
        int seatNum = Integer.parseInt(seatNumber.substring(1));

        int maxRow = (totalSeats / seatsPerRow);
        int maxRowLetter = 'A' + maxRow - 1;

        return row <= maxRowLetter && seatNum <= seatsPerRow;
    }





}
