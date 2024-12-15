package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.MaintenanceStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MaintenanceStaffRepository extends JpaRepository<MaintenanceStaff, UUID> {
    Optional<MaintenanceStaff> findByEmail(String email);
}
