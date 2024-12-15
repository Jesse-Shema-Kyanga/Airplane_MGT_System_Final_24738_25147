package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.Pilot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PilotRepository extends JpaRepository<Pilot, UUID> {
    Optional<Pilot> findByEmail(String email);




    @Query("SELECT COUNT(p) FROM Pilot p WHERE p.status = 'ACTIVE'")
    Long countActivePilots();


    List<Pilot> findByStatus(String status);


    @Query("SELECT p FROM Pilot p WHERE p.status = 'ACTIVE' AND p.yearsOfExperience > 10")
    List<Pilot> findSeniorActivePilots();

    @Query("SELECT p FROM Pilot p WHERE p.status = 'ACTIVE' AND p.yearsOfExperience <= 10")
    List<Pilot> findJuniorActivePilots();
}
