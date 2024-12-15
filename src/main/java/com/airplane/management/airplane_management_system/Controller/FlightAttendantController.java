package com.airplane.management.airplane_management_system.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.FlightAttendant;
import com.airplane.management.airplane_management_system.Service.FlightAttendantService;

@RestController
@RequestMapping("/flight-attendant")
public class FlightAttendantController {
    @Autowired
    private FlightAttendantService flightAttendantService;

    @GetMapping(value = "/assigned-flights/{flightAttendantId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Flight>> viewAssignedFlights(@PathVariable UUID flightAttendantId) {
        List<Flight> flights = flightAttendantService.viewAssignedFlights(flightAttendantId);
        return ResponseEntity.ok(flights);
    }

    @PutMapping(value = "/assign-flight/{flightAttendantId}/{flightId}")
    public ResponseEntity<FlightAttendant> assignFlight(@PathVariable UUID flightAttendantId, @PathVariable UUID flightId) {
        FlightAttendant updatedFlightAttendant = flightAttendantService.assignFlight(flightAttendantId, flightId);
        return ResponseEntity.ok(updatedFlightAttendant);
    }

    @PostMapping(value = "/saveFlightAttendant", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FlightAttendant> createFlightAttendant(@RequestBody FlightAttendant flightAttendant) {
        FlightAttendant savedFlightAttendant = flightAttendantService.save(flightAttendant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFlightAttendant);
    }

    @PutMapping(value = "/updateFlightAttendant/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FlightAttendant> updateFlightAttendant(
            @PathVariable("id") UUID flightAttendantId,
            @RequestBody FlightAttendant flightAttendantDetails) {
        try {
            FlightAttendant updatedFlightAttendant = flightAttendantService.updateFlightAttendant(flightAttendantId, flightAttendantDetails);
            return ResponseEntity.status(HttpStatus.OK).body(updatedFlightAttendant);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping(value = "/deleteFlightAttendant/{id}")
    public ResponseEntity<String> deleteFlightAttendant(@PathVariable("id") UUID flightAttendantId) {
        try {
            flightAttendantService.delete(flightAttendantId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Flight Attendant deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Flight Attendant not found");
        }
    }

    @GetMapping("/getAllFlightAttendants")
    public ResponseEntity<Page<FlightAttendant>> getAllFlightAttendants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<FlightAttendant> flightAttendants = flightAttendantService.getAllFlightAttendants(pageable);
        return ResponseEntity.ok(flightAttendants);
    }

    @GetMapping(value = "/countActiveFlightAttendant")
    public ResponseEntity<Long> countActiveFlightAttendants() {
        Long count = flightAttendantService.countActiveFlightAttendants();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/junior")
    public ResponseEntity<List<FlightAttendant>> getJuniorAttendants() {
        return ResponseEntity.ok(flightAttendantService.getJuniorActiveAttendants());
    }

    @GetMapping("/mid-level")
    public ResponseEntity<List<FlightAttendant>> getMidLevelAttendants() {
        return ResponseEntity.ok(flightAttendantService.getMidLevelActiveAttendants());
    }

    @GetMapping("/senior")
    public ResponseEntity<List<FlightAttendant>> getSeniorAttendants() {
        return ResponseEntity.ok(flightAttendantService.getSeniorActiveAttendants());
    }
}
