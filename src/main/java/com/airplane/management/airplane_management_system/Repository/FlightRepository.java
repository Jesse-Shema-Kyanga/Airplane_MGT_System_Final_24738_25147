package com.airplane.management.airplane_management_system.Repository;

import com.airplane.management.airplane_management_system.Model.Flight;
import com.airplane.management.airplane_management_system.Model.FlightAttendant;
import com.airplane.management.airplane_management_system.Model.Pilot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface FlightRepository extends JpaRepository<Flight, UUID> {
    List<Flight> findByDepartureLocationAndArrivalLocationAndDepartureTimeBetween(String departureLocation, String arrivalLocation, LocalDateTime startTime, LocalDateTime endTime);


    List<Flight> findByFlightAttendantsContains(FlightAttendant flightAttendant);

    List<Flight> findByPilotsContains(Pilot pilot);

    Flight findByFlightNumber(String flightNumber);


    @Query("SELECT COUNT(f) FROM Flight f WHERE f.departureTime >= :startOfDay AND f.departureTime < :endOfDay")
    Long countFlightsToday(LocalDateTime startOfDay, LocalDateTime endOfDay);
}
