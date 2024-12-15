package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private UserRepository userRepository;

    public String registerPassenger(Passenger passenger) {
        Optional<Passenger> checkPassenger = passengerRepository.findByName(passenger.getName());
        if (checkPassenger.isPresent()) {
            return "passenger exists";
        } else {
            passengerRepository.save(passenger);
            return "passenger saved successfully";
        }
    }

    public Passenger authenticatePassenger(String email, String password) {
        Optional<Passenger> passengerOpt = passengerRepository.findByEmail(email);
        if (passengerOpt.isPresent() && passengerOpt.get().getPassword().equals(password)) {
            return passengerOpt.get();
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

    public List<Flight> searchFlights(String departureLocation, String arrivalLocation, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return flightRepository.findByDepartureLocationAndArrivalLocationAndDepartureTimeBetween(departureLocation, arrivalLocation, startOfDay, endOfDay);
    }

    /*public Ticket bookTicket(String email, String flightNumber, String seatNumber, double price) {
        Flight flight = flightRepository.findByFlightNumber(flightNumber); // Find flight by flight number
        Optional<User> userOptional = userRepository.findByEmail(email); // Find user by email

        if (userOptional.isPresent() && flight != null) {
            User user = userOptional.get(); // Extract User object from Optional
            Ticket ticket = new Ticket(flight, user, seatNumber, LocalDate.now(), price, Ticket.TicketStatus.BOOKED);
            return ticketRepository.save(ticket);
        }
        return null;
    }*/


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
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket != null) {
            ticket.setStatus(Ticket.TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
        }
    }

    public Ticket checkIn(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);

        if (ticket != null && ticket.getStatus() == Ticket.TicketStatus.BOOKED) {
            ticket.setStatus(Ticket.TicketStatus.CHECKED_IN);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public Flight viewFlightStatus(UUID flightId) {
        return flightRepository.findById(flightId).orElse(null);
    }
}

