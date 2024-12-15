package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Service.AdminService;
import com.airplane.management.airplane_management_system.Service.PilotService;
import com.airplane.management.airplane_management_system.Service.AirplaneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;
    @Autowired
    private PilotService pilotService;
    @Autowired
    private AirplaneService airplaneService;

    // Create flight endpoint
    @PostMapping(value = "/create-flight", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Flight> createFlight(@RequestParam String flightNumber, @RequestParam String departureLocation, @RequestParam String arrivalLocation, @RequestParam LocalDateTime departureTime, @RequestParam LocalDateTime arrivalTime, @RequestParam UUID airplaneId, @RequestParam Flight.FlightStatus status) {
        Flight newFlight = adminService.createFlight(flightNumber, departureLocation, arrivalLocation, departureTime, arrivalTime, airplaneId, status);
        if (newFlight != null) {
            return ResponseEntity.ok(newFlight);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Update flight endpoint
    @PutMapping(value = "/update-flight/{flightId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Flight> updateFlight(@PathVariable UUID flightId, @RequestParam String flightNumber, @RequestParam String departureLocation, @RequestParam String arrivalLocation, @RequestParam LocalDateTime departureTime, @RequestParam LocalDateTime arrivalTime, @RequestParam UUID airplaneId, @RequestParam Flight.FlightStatus status) {
        Flight updatedFlight = adminService.updateFlight(flightId, flightNumber, departureLocation, arrivalLocation, departureTime, arrivalTime, airplaneId, status);
        if (updatedFlight != null) {
            return ResponseEntity.ok(updatedFlight);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Assign pilot to flight endpoint
    @PutMapping(value = "/assign-pilot/{pilotId}/{flightId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Pilot> assignPilot(@PathVariable UUID pilotId, @PathVariable UUID flightId) {
        Pilot updatedPilot = adminService.assignPilot(pilotId, flightId);
        if (updatedPilot != null) {
            return ResponseEntity.ok(updatedPilot);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Assign flight attendant to flight endpoint
    @PutMapping(value = "/assign-flight-attendant/{flightAttendantId}/{flightId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FlightAttendant> assignFlightAttendant(@PathVariable UUID flightAttendantId, @PathVariable UUID flightId) {
        FlightAttendant updatedFlightAttendant = adminService.assignFlightAttendant(flightAttendantId, flightId);
        if (updatedFlightAttendant != null) {
            return ResponseEntity.ok(updatedFlightAttendant);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Set maintenance status of airplane endpoint
    @PutMapping(value = "/set-maintenance-status/{airplaneId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Airplane> setMaintenanceStatus(@PathVariable UUID airplaneId, @RequestParam Airplane.MaintenanceStatus status) {
        Airplane updatedAirplane = adminService.setMaintenanceStatus(airplaneId, status);
        if (updatedAirplane != null) {
            return ResponseEntity.ok(updatedAirplane);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Get ticket sales report endpoint
    @GetMapping(value = "/ticket-sales-report", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Ticket>> getTicketSalesReport() {
        List<Ticket> salesReport = adminService.getTicketSalesReport();
        return ResponseEntity.ok(salesReport);
    }
}
