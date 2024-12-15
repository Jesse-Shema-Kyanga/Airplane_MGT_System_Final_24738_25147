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
import com.airplane.management.airplane_management_system.Model.Pilot;
import com.airplane.management.airplane_management_system.Service.PilotService;

@RestController
@RequestMapping("/pilot")
public class PilotController {
    @Autowired
    private PilotService pilotService;

    @GetMapping(value = "/assigned-flights/{pilotId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Flight>> viewAssignedFlights(@PathVariable UUID pilotId) {
        List<Flight> flights = pilotService.viewAssignedFlights(pilotId);
        return ResponseEntity.ok(flights);
    }

    @PutMapping(value = "/assign-flight/{pilotId}/{flightId}")
    public ResponseEntity<Pilot> assignFlight(@PathVariable UUID pilotId, @PathVariable UUID flightId) {
        Pilot updatedPilot = pilotService.assignFlight(pilotId, flightId);
        return ResponseEntity.ok(updatedPilot);
    }

    @PostMapping(value = "/savePilot", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Pilot> createPilot(@RequestBody Pilot pilot) {
        Pilot savedPilot = pilotService.save(pilot);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPilot);
    }

    @PutMapping(value = "/updatePilot/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Pilot> updatePilot(
            @PathVariable("id") UUID pilotId,
            @RequestBody Pilot pilotDetails) {
        try {
            Pilot updatedPilot = pilotService.updatePilot(pilotId, pilotDetails);
            return ResponseEntity.status(HttpStatus.OK).body(updatedPilot);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping(value = "/deletePilot/{id}")
    public ResponseEntity<String> deletePilot(@PathVariable("id") UUID pilotId) {
        try {
            pilotService.delete(pilotId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Pilot deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pilot not found");
        }
    }

    @GetMapping("/getAllPilots")
    public Page<Pilot> getAllPilots(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return pilotService.getAllPilots(PageRequest.of(page, size));
    }

    @GetMapping(value = "/countActive")
    public ResponseEntity<Long> countActivePilots() {
        Long count = pilotService.countActivePilots();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/senior")
    public ResponseEntity<List<Pilot>> getSeniorActivePilots() {
        List<Pilot> seniorPilots = pilotService.getSeniorActivePilots();
        return ResponseEntity.ok(seniorPilots);
    }

    @GetMapping("/junior")
    public ResponseEntity<List<Pilot>> getJuniorActivePilots() {
        List<Pilot> juniorPilots = pilotService.getJuniorActivePilots();
        return ResponseEntity.ok(juniorPilots);
    }
}
