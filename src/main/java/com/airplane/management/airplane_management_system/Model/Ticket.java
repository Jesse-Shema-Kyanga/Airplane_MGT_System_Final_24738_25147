package com.airplane.management.airplane_management_system.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID ticketId;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight; // Foreign Key to Flight

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;// Foreign Key to User (previously Passenger)
    private String userEmail;


    private String seatNumber;
    private LocalDate bookingDate;
    private double price;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    public enum TicketStatus {
        BOOKED, CANCELLED, CHECKED_IN
    }

    // Default Constructor
    public Ticket() {}

    // Parameterized Constructor
    public Ticket(Flight flight, User user, String seatNumber, LocalDate bookingDate,
                  double price, TicketStatus status) {
        this.flight = flight;
        this.user = user;
        this.seatNumber = seatNumber;
        this.bookingDate = bookingDate;
        this.price = price;
        this.status = status;
    }

    // Getters and Setters
    public UUID getTicketId() {
        return ticketId;
    }

    public void setTicketId(UUID ticketId) {
        this.ticketId = ticketId;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
