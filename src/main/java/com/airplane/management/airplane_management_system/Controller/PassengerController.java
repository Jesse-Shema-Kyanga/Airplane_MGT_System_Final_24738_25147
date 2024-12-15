package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/passengers")
public class PassengerController {

    @Autowired
    private PassengerService passengerService;

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerPassenger(@RequestBody Passenger passenger) {
        String result = passengerService.registerPassenger(passenger);
        if ("passenger exists".equalsIgnoreCase(result)) {
            return new ResponseEntity<>("Passenger exists", HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>("Passenger saved successfully", HttpStatus.OK);
        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<String> loginPassenger(@RequestParam String email, @RequestParam String password) {
        Passenger authenticatedPassenger = passengerService.authenticatePassenger(email, password);
        if (authenticatedPassenger != null) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(401).body("Authentication failed");
        }
    }

    @GetMapping(value = "/print-boarding-pass/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> printBoardingPass(@PathVariable UUID ticketId) {
        String boardingPass = passengerService.printBoardingPass(ticketId);
        return ResponseEntity.ok(boardingPass);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Map<String, Object>>> searchFlights(@RequestParam String departureLocation,
                                                                   @RequestParam String arrivalLocation,
                                                                   @RequestParam LocalDate date) {
        List<Flight> flights = passengerService.searchFlights(departureLocation, arrivalLocation, date);

        // Transform the response to only include relevant information
        List<Map<String, Object>> filteredFlights = flights.stream().map(flight -> {
            Map<String, Object> flightMap = new HashMap<>();
            flightMap.put("flightId", flight.getFlightId());
            flightMap.put("flightNumber", flight.getFlightNumber());
            flightMap.put("departureLocation", flight.getDepartureLocation());
            flightMap.put("arrivalLocation", flight.getArrivalLocation());
            flightMap.put("departureTime", flight.getDepartureTime());
            flightMap.put("arrivalTime", flight.getArrivalTime());
            flightMap.put("airplaneId", flight.getAirplane().getAirplaneId());
            flightMap.put("status", flight.getStatus());
            return flightMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(filteredFlights);
    }

    /*@PostMapping(value = "/book/{flightId}")
    public ResponseEntity<Ticket> bookTicket(@PathVariable UUID flightId,
                                             @RequestParam UUID passengerId,
                                             @RequestParam String seatNumber,
                                             @RequestParam double price) {
        Ticket ticket = passengerService.bookTicket(passengerId, flightId, seatNumber, price);
        return ResponseEntity.ok(ticket);
    }*/

    @PutMapping(value = "/modify/{ticketId}")
    public ResponseEntity<Ticket> modifyTicket(@PathVariable UUID ticketId,
                                               @RequestParam String newSeatNumber,
                                               @RequestParam double newPrice) {
        Ticket ticket = passengerService.modifyTicket(ticketId, newSeatNumber, newPrice);
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping(value = "/cancel/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> cancelTicket(@PathVariable UUID ticketId) {
        passengerService.cancelTicket(ticketId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/checkin/{ticketId}")
    public ResponseEntity<Ticket> checkIn(@PathVariable UUID ticketId) {
        Ticket ticket = passengerService.checkIn(ticketId);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping(value = "/status/{flightId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Flight> viewFlightStatus(@PathVariable UUID flightId) {
        Flight flight = passengerService.viewFlightStatus(flightId);
        return ResponseEntity.ok(flight);
    }
}
