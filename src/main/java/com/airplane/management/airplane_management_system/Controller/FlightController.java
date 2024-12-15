package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.Pilot;
import com.airplane.management.airplane_management_system.Model.FlightAttendant;
import com.airplane.management.airplane_management_system.Repository.PilotRepository;
import com.airplane.management.airplane_management_system.Repository.FlightAttendantRepository;
import com.airplane.management.airplane_management_system.Service.FlightService;
import com.airplane.management.airplane_management_system.Service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/flights")
public class FlightController {
    @Autowired
    private SeatService seatService;
    @Autowired
    private FlightService flightService;
    @Autowired
    private PilotRepository pilotRepository;
    @Autowired
    private FlightAttendantRepository flightAttendantRepository;

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createFlight(@RequestBody Flight flight, @RequestParam String makeNumber) {
        String message = flightService.createFlightWithMakeNumber(flight, makeNumber);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{flightId}/available-seats")
    public ResponseEntity<List<String>> getAvailableSeats(@PathVariable UUID flightId) {
        List<String> availableSeats = seatService.getAvailableSeats(flightId);
        return ResponseEntity.ok(availableSeats);
    }

    @GetMapping("/{flightId}/validate-seat/{seatNumber}")
    public ResponseEntity<Boolean> validateSeat(@PathVariable UUID flightId,
                                                @PathVariable String seatNumber) {
        Flight flight = flightService.getFlight(flightId);
        boolean isValid = seatService.validateSeatNumber(seatNumber,
                flight.getAirplane().getTotalSeats(),
                flight.getAirplane().getSeatsPerRow());
        return ResponseEntity.ok(isValid);
    }

    @PutMapping(value = "/assign-details-with-make/{flightId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Flight> updateFlightDetails(@PathVariable UUID flightId,
                                                      @RequestBody Flight flightDetails,
                                                      @RequestParam String makeNumber) {
        Flight updatedFlight = flightService.updateFlightDetails(flightId, flightDetails, makeNumber);
        return updatedFlight != null ? ResponseEntity.ok(updatedFlight) :
                ResponseEntity.badRequest().build();
    }

    @PutMapping(value = "/set-status/{flightId}")
    public ResponseEntity<Flight> setFlightStatus(@PathVariable UUID flightId,
                                                  @RequestParam Flight.FlightStatus status) {
        Flight updatedFlight = flightService.setFlightStatus(flightId, status);
        return updatedFlight != null ? ResponseEntity.ok(updatedFlight) :
                ResponseEntity.badRequest().build();
    }

    @GetMapping(value = "/assigned-flights/pilot/{pilotId}")
    public ResponseEntity<List<Flight>> viewAssignedFlightsForPilot(@PathVariable UUID pilotId) {
        Pilot pilot = pilotRepository.findById(pilotId).orElse(null);
        List<Flight> flights = flightService.viewAssignedFlights(pilot);
        return ResponseEntity.ok(flights);
    }

    @GetMapping(value = "/assigned-flights/flight-attendant/{flightAttendantId}")
    public ResponseEntity<List<Flight>> viewAssignedFlightsForFlightAttendant(@PathVariable UUID flightAttendantId) {
        FlightAttendant flightAttendant = flightAttendantRepository.findById(flightAttendantId).orElse(null);
        List<Flight> flights = flightService.viewAssignedFlights(flightAttendant);
        return ResponseEntity.ok(flights);
    }

    @GetMapping(value = "/{flightId}")
    public ResponseEntity<Flight> getFlight(@PathVariable UUID flightId) {
        Flight flight = flightService.getFlight(flightId);
        return flight != null ? ResponseEntity.ok(flight) :
                ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/all")
    public ResponseEntity<Page<Flight>> getAllFlights(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Flight> flights = flightService.getAllFlights(pageable);
        return ResponseEntity.ok(flights);
    }

    @DeleteMapping(value = "/delete/{flightId}")
    public ResponseEntity<Void> deleteFlight(@PathVariable UUID flightId) {
        flightService.deleteFlight(flightId);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/search")
    public ResponseEntity<List<Flight>> searchFlights(@RequestParam String departureLocation,
                                                      @RequestParam String arrivalLocation,
                                                      @RequestParam LocalDateTime startTime,
                                                      @RequestParam LocalDateTime endTime) {
        List<Flight> flights = flightService.searchFlights(departureLocation, arrivalLocation,
                startTime, endTime);
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/getAllFlight")
    public ResponseEntity<List<Flight>> getAllFlightsList() {
        try {
            List<Flight> flights = flightService.getAllFlights();
            if (flights.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(flights, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/countFlightsToday")
    public ResponseEntity<Long> countFlightsToday() {
        Long count = flightService.countFlightsToday();
        return ResponseEntity.ok(count);
    }
}
