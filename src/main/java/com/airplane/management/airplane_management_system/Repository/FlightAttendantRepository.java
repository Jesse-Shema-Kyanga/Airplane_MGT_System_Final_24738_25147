package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.FlightAttendant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FlightAttendantRepository extends JpaRepository<FlightAttendant, UUID> {
    Optional<FlightAttendant> findByEmail(String email);

    @Query("SELECT COUNT(fa) FROM FlightAttendant fa WHERE fa.status = 'ACTIVE'")
    Long countActiveFlightAttendants();

    @Query("SELECT fa FROM FlightAttendant fa WHERE fa.status = 'ACTIVE' AND fa.yearsOfExperience < 10")
    List<FlightAttendant> findJuniorActiveAttendants();

    @Query("SELECT fa FROM FlightAttendant fa WHERE fa.status = 'ACTIVE' AND fa.yearsOfExperience >= 10 AND fa.yearsOfExperience < 17")
    List<FlightAttendant> findMidLevelActiveAttendants();

    @Query("SELECT fa FROM FlightAttendant fa WHERE fa.status = 'ACTIVE' AND fa.yearsOfExperience >= 18")
    List<FlightAttendant> findSeniorActiveAttendants();
}
