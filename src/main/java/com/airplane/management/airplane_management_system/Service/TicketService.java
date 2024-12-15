package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class TicketService {

    @Autowired
    SeatService seatService;
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository; // Changed from PassengerRepository to UserRepository

    public List<Flight> searchFlights(String departureLocation, String arrivalLocation, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return flightRepository.findByDepartureLocationAndArrivalLocationAndDepartureTimeBetween(departureLocation, arrivalLocation, startOfDay, endOfDay);
    }

    public Ticket changeSeat(UUID ticketId, String newSeatNumber) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Flight flight = ticket.getFlight();

        if (!seatService.isSeatAvailable(flight.getFlightId(), newSeatNumber)) {
            throw new RuntimeException("Seat is already taken");
        }

        if (!seatService.validateSeatNumber(newSeatNumber,
                flight.getAirplane().getTotalSeats(),
                flight.getAirplane().getSeatsPerRow())) {
            throw new RuntimeException("Invalid seat number");
        }

        ticket.setSeatNumber(newSeatNumber);
        return ticketRepository.save(ticket);
    }


    public String bookTicket(String email, String flightNumber, String seatNumber, double price) {
        // Trim and ensure case consistency for the flight number
        flightNumber = flightNumber.trim().toUpperCase();

        // Log the flight number being queried
        System.out.println("Querying for flight number: " + flightNumber);

        Flight flight = flightRepository.findByFlightNumber(flightNumber);

        // Log the flight retrieved
        if (flight != null) {
            System.out.println("Flight found: " + flight.getFlightNumber());
        } else {
            System.out.println("Flight not found for flightNumber: " + flightNumber);
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        // Add logging or debug statement
        if (userOptional.isPresent()) {
            System.out.println("User found: " + userOptional.get().getEmail());
        } else {
            System.out.println("User not found for email: " + email);
        }

        // Check if both flight and user are found
        if (userOptional.isPresent() && flight != null) {
            User user = userOptional.get();
            Ticket ticket = new Ticket(flight, user, seatNumber, LocalDate.now(), price, Ticket.TicketStatus.BOOKED);
            ticketRepository.save(ticket);
            return "Ticket booked successfully!";
        }
        return "Booking failed: flight or user not found.";
    }







    public Ticket bookSeatForFlight(UUID flightId, String seatNumber, String userEmail) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (!seatService.isSeatAvailable(flightId, seatNumber)) {
            throw new RuntimeException("Seat is already taken");
        }

        if (!seatService.validateSeatNumber(seatNumber,
                flight.getAirplane().getTotalSeats(),
                flight.getAirplane().getSeatsPerRow())) {
            throw new RuntimeException("Invalid seat number");
        }

        Ticket ticket = new Ticket();
        ticket.setFlight(flight);
        ticket.setSeatNumber(seatNumber);
        ticket.setUserEmail(userEmail);

        return ticketRepository.save(ticket);
    }




    public Ticket modifyTicket(UUID ticketId, String newSeatNumber, double newPrice) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket != null) {
            ticket.setSeatNumber(newSeatNumber);
            ticket.setPrice(newPrice);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public void cancelTicket(UUID ticketId) {
        ticketRepository.deleteById(ticketId);
    }
    public Ticket findById(UUID ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
    }
    public List<String> getOccupiedSeats(UUID flightId) {
        List<Ticket> tickets = ticketRepository.findByFlight_FlightId(flightId);
        return tickets.stream()
                .map(Ticket::getSeatNumber)
                .collect(Collectors.toList());
    }




    public Ticket checkIn(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket != null && ticket.getStatus() == Ticket.TicketStatus.BOOKED) {
            ticket.setStatus(Ticket.TicketStatus.CHECKED_IN);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public String printBoardingPass(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket != null && ticket.getStatus() == Ticket.TicketStatus.CHECKED_IN) {
            return "Boarding Pass for Ticket ID: " + ticketId + "\nFlight: " + ticket.getFlight().getFlightNumber() + "\nSeat: " + ticket.getSeatNumber();
        }
        return "Unable to print boarding pass. Please check in first.";
    }

    public Flight viewFlightStatus(UUID flightId) {
        return flightRepository.findById(flightId).orElse(null);
    }

    public List<Ticket> getTicketsByUserEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ticketRepository.findByUser(user.get());
        }
        return new ArrayList<>();
    }
}
