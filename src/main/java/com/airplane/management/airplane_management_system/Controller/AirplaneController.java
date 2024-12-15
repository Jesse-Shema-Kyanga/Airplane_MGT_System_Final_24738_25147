package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.Airplane;
import com.airplane.management.airplane_management_system.Service.AirplaneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/airplanes")
public class AirplaneController {
    @Autowired
    private AirplaneService airplaneService;

    @PostMapping(value = "/save", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Airplane> saveAirplane(@RequestBody Airplane airplane) {
        Airplane savedAirplane = airplaneService.save(airplane);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAirplane);
    }

    // Fetch all airplanes
    @GetMapping("/getAll")
    public ResponseEntity<Page<Airplane>> getAllAirplanes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        PageRequest pageable = PageRequest.of(page, size);
        Page<Airplane> airplanes = airplaneService.getAllAirplanes(pageable);
        return ResponseEntity.ok(airplanes);
    }

    // Find an airplane by ID
    @GetMapping(value = "/{airplaneId}")
    public ResponseEntity<Airplane> getAirplaneById(@PathVariable UUID airplaneId) {
        Airplane airplane = airplaneService.getAirplaneById(airplaneId);
        if (airplane != null) {
            return ResponseEntity.ok(airplane);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Update an airplane's details
    @PutMapping(value = "/update/{airplaneId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Airplane> updateAirplane(
            @PathVariable UUID airplaneId, @RequestBody Airplane airplaneDetails) {
        try {
            Airplane updatedAirplane = airplaneService.updateAirplane(airplaneId, airplaneDetails);
            return ResponseEntity.ok(updatedAirplane);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Delete an airplane by ID
    @DeleteMapping(value = "/delete/{airplaneId}")
    public ResponseEntity<String> deleteAirplane(@PathVariable UUID airplaneId) {
        try {
            airplaneService.delete(airplaneId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Airplane deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Airplane not found");
        }
    }

    // // Fetch airplanes by maintenance status
    // @GetMapping("/byMaintenanceStatus/{maintenanceStatus}")
    // public ResponseEntity<List<Airplane>> getAirplanesByMaintenanceStatus(@PathVariable Airplane.MaintenanceStatus maintenanceStatus) {
    //     List<Airplane> airplanes = airplaneService.getAirplanesByMaintenanceStatus(maintenanceStatus);
    //     return ResponseEntity.ok(airplanes);
    // }


    @GetMapping(value = "/count")
    public ResponseEntity<Long> countTotalAirplanes() {
        return ResponseEntity.ok(airplaneService.countTotalAirplanes());
    }



    @GetMapping("/good-status")
    public ResponseEntity<List<Airplane>> getGoodStatusAirplanes() {
        return ResponseEntity.ok(airplaneService.getAllGoodStatusAirplanes());
    }
}