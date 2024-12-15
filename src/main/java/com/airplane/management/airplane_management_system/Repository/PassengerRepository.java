package com.airplane.management.airplane_management_system.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.airplane.management.airplane_management_system.Model.Passenger;
import java.util.Optional;

public interface PassengerRepository extends JpaRepository<Passenger, UUID> {
    Optional<Passenger> findByName(String name);
    Optional<Passenger> findByEmail(String email);
}


