package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Service.SeatService;
import com.airplane.management.airplane_management_system.Service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;
    @Autowired
    private SeatService seatService;

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Flight>> searchFlights(@RequestParam String departureLocation,
                                                      @RequestParam String arrivalLocation,
                                                      @RequestParam LocalDate date) {
        List<Flight> flights = ticketService.searchFlights(departureLocation, arrivalLocation, date);
        return ResponseEntity.ok(flights);
    }
    @PutMapping("/change-seat/{ticketId}")
    public ResponseEntity<Ticket> changeSeat(
            @PathVariable UUID ticketId,
            @RequestParam String newSeatNumber) {
        Ticket updatedTicket = ticketService.changeSeat(ticketId, newSeatNumber);
        return ResponseEntity.ok(updatedTicket);
    }




    @PostMapping(value = "/book", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> bookTicket(@RequestParam String email,
                                             @RequestParam String flightNumber,
                                             @RequestBody Ticket ticketDetails) {
        String result = ticketService.bookTicket(email, flightNumber, ticketDetails.getSeatNumber(), ticketDetails.getPrice());
        if ("Ticket booked successfully!".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }


    @PutMapping(value = "/modify/{ticketId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ticket> modifyTicket(@PathVariable UUID ticketId,
                                               @RequestParam String newSeatNumber,
                                               @RequestParam double newPrice) {
        Ticket ticket = ticketService.modifyTicket(ticketId, newSeatNumber, newPrice);
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping(value = "/cancel/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> cancelTicket(@PathVariable UUID ticketId) {
        ticketService.cancelTicket(ticketId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/checkin/{ticketId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ticket> checkIn(@PathVariable UUID ticketId) {
        Ticket ticket = ticketService.checkIn(ticketId);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping(value = "/print-boarding-pass/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> printBoardingPass(@PathVariable UUID ticketId) {
        String boardingPass = ticketService.printBoardingPass(ticketId);
        return ResponseEntity.ok(boardingPass);
    }
    @GetMapping(value = "/user/{email}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable String email) {
        List<Ticket> tickets = ticketService.getTicketsByUserEmail(email);
        return ResponseEntity.ok(tickets);
    }



    @GetMapping(value = "/status/{flightId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Flight> viewFlightStatus(@PathVariable UUID flightId) {
        Flight flight = ticketService.viewFlightStatus(flightId);
        return ResponseEntity.ok(flight);
    }

    @GetMapping("flights/{flightId}/occupied-seats")
    public ResponseEntity<List<String>> getOccupiedSeats(@PathVariable UUID flightId) {
        List<String> occupiedSeats = ticketService.getOccupiedSeats(flightId);
        return ResponseEntity.ok(occupiedSeats);
    }
    @GetMapping("/flights/{flightId}/available-seats")
    public ResponseEntity<List<String>> getAvailableSeats(@PathVariable UUID flightId) {
        List<String> availableSeats = seatService.getAvailableSeats(flightId);
        return ResponseEntity.ok(availableSeats);
    }


}
