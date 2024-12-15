package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.*;
import com.airplane.management.airplane_management_system.Service.MaintenanceStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/maintenance-staff")
public class MaintenanceStaffController {
    @Autowired
    private MaintenanceStaffService maintenanceStaffService;

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerMaintenanceStaff(@RequestBody MaintenanceStaff maintenanceStaff) {
        String result = maintenanceStaffService.registerMaintenanceStaff(maintenanceStaff);
        if ("maintenance staff exists".equalsIgnoreCase(result)) {
            return new ResponseEntity<>("Maintenance staff exists", HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>("Maintenance staff saved successfully", HttpStatus.OK);
        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<String> loginMaintenanceStaff(@RequestParam String email, @RequestParam String password) {
        MaintenanceStaff authenticatedMaintenanceStaff = maintenanceStaffService.authenticateMaintenanceStaff(email, password);
        if (authenticatedMaintenanceStaff != null) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(401).body("Authentication failed");
        }
    }

    @PostMapping(value = "/log-issue/{airplaneId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> logOperationalIssue(@PathVariable UUID airplaneId, @RequestBody MaintenanceStaff maintenanceStaff) {
        maintenanceStaffService.logOperationalIssue(airplaneId, maintenanceStaff.getOperationalIssues());
        return ResponseEntity.ok().build();
    }
}
