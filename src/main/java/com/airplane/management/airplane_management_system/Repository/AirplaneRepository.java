package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.Airplane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface AirplaneRepository extends JpaRepository<Airplane, UUID> {
    Airplane findByMakeNumber(String makeNumber);
    // Custom query methods can be added here if needed
    @Query("SELECT COUNT(a) FROM Airplane a")
    Long countTotalAirplanes();

    @Query("SELECT a FROM Airplane a WHERE a.maintenanceStatus = 'GOOD'")
    List<Airplane> findByMaintenanceStatus();

}
