package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.MaintenanceStaff;
import com.airplane.management.airplane_management_system.Model.Airplane;
import com.airplane.management.airplane_management_system.Repository.MaintenanceStaffRepository;
import com.airplane.management.airplane_management_system.Repository.AirplaneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class MaintenanceStaffService {
    @Autowired
    private MaintenanceStaffRepository maintenanceStaffRepository;

    @Autowired
    private AirplaneRepository airplaneRepository;

    public String registerMaintenanceStaff(MaintenanceStaff maintenanceStaff) {
        Optional<MaintenanceStaff> checkMaintenanceStaff = maintenanceStaffRepository.findByEmail(maintenanceStaff.getEmail());
        if (checkMaintenanceStaff.isPresent()) {
            return "maintenance staff exists";
        } else {
            maintenanceStaffRepository.save(maintenanceStaff);
            return "maintenance staff saved successfully";
        }
    }

    public MaintenanceStaff authenticateMaintenanceStaff(String email, String password) {
        Optional<MaintenanceStaff> optionalMaintenanceStaff = maintenanceStaffRepository.findByEmail(email);
        if (optionalMaintenanceStaff.isPresent()) {
            MaintenanceStaff maintenanceStaff = optionalMaintenanceStaff.get();
            if (maintenanceStaff.getPassword().equals(password)) {
                return maintenanceStaff;
            }
        }
        return null;
    }

    public void logOperationalIssue(UUID airplaneId, String issueDescription) {
        Airplane airplane = airplaneRepository.findById(airplaneId).orElse(null);
        if (airplane != null) {
            airplane.setOperationalIssues(issueDescription);
            airplaneRepository.save(airplane);
        }
    }
}
