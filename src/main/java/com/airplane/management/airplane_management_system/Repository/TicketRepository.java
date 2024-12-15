package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.airplane.management.airplane_management_system.Model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByFlight_FlightId(UUID flightId);
    List<Ticket> findByUser(User user);


}

