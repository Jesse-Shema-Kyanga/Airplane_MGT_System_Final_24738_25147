package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/seats")
public class SeatController {
    @Autowired
    private SeatService seatService;

    @GetMapping("/flights/{flightId}/occupied")
    public ResponseEntity<List<String>> getOccupiedSeats(@PathVariable UUID flightId) {
        List<String> occupiedSeats = seatService.getOccupiedSeats(flightId);
        return ResponseEntity.ok(occupiedSeats);
    }

    @GetMapping("/flights/{flightId}/available")
    public ResponseEntity<List<String>> getAvailableSeats(@PathVariable UUID flightId) {
        List<String> availableSeats = seatService.getAvailableSeats(flightId);
        return ResponseEntity.ok(availableSeats);
    }
}
