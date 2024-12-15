import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';
import SeatMap from '../components/SeatMap';
import "../pages/homeStyles.css";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showSeatMap, setShowSeatMap] = useState(false);
const [selectedTicketId, setSelectedTicketId] = useState(null);
const [selectedFlightId, setSelectedFlightId] = useState(null);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [selectedNewSeat, setSelectedNewSeat] = useState(null);

const handleSeatSelect = (seatNumber) => {
    setSelectedNewSeat(seatNumber);
    setShowConfirmModal(true);
};

const confirmSeatChange = async () => {
    try {
        const response = await fetch(`http://localhost:8080/tickets/change-seat/${selectedTicketId}?newSeatNumber=${selectedNewSeat}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            showToastMessage('Seat changed successfully');
            setShowSeatMap(false);
            setShowConfirmModal(false);
            fetchTickets();
        } else {
            throw new Error('Failed to change seat');
        }
    } catch (error) {
        showToastMessage('Error changing seat');
    }
};

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch(`http://localhost:8080/tickets/user/${userEmail}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            showToastMessage('Error fetching tickets');
        } finally {
            setIsLoading(false);
        }
    };
    

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleCancelTicket = async (ticketId) => {
        if (window.confirm('Are you sure you want to cancel this ticket?')) {
            try {
                const response = await fetch(`http://localhost:8080/tickets/cancel/${ticketId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToastMessage('Ticket cancelled successfully');
                    // Remove the cancelled ticket from state immediately
                    setTickets(tickets.filter(ticket => ticket.ticketId !== ticketId));
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showToastMessage('Error cancelling ticket');
            }
        }
    };
    
    
    const handleChangeSeat = async (ticketId, flightId) => {
        setShowSeatMap(true);
        setSelectedTicketId(ticketId);
        setSelectedFlightId(flightId);
    };
    

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="#">SkyWings Airlines</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><NavLink className="nav-link" to="/home">Home</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link active" to="/passenger-flights">Flights</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/my-tickets">My Tickets</NavLink></li>
                            <li className="nav-item"><NavLink className="nav-link" to="/">Logout</NavLink></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '100px' }}>
                <h2 className="mb-4">My Tickets</h2>

                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center">
                        <p>No tickets found. Book a flight to get started!</p>
                        <NavLink to="/passenger-flights" className="btn btn-primary">
                            Browse Flights
                        </NavLink>
                    </div>
                ) : (
                    <div className="row">
                        {tickets.map((ticket) => (
                            <div key={ticket.ticketId} className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title mb-0">Ticket #{ticket.ticketNumber}</h5>
                                            <span className={`badge bg-${ticket.status === 'CONFIRMED' ? 'success' : 
                                                ticket.status === 'CANCELLED' ? 'danger' : 'warning'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="flight-details mb-3">
    <p className="mb-1"><strong>Flight:</strong> {ticket.flight.flightNumber}</p>
    <p className="mb-1">
        <strong>From:</strong> {ticket.flight.departureLocation} →{' '}
        <strong>To:</strong> {ticket.flight.arrivalLocation}
    </p>
    <p className="mb-1">
        <strong>Departure:</strong>{' '}
        {new Date(ticket.flight.departureTime).toLocaleString()}
    </p>
    <p className="mb-1">
        <strong>Seat:</strong> {ticket.seatNumber}
    </p>
    <p className="mb-1">
        <strong>Price:</strong> ${ticket.flight.price.toFixed(2)}
    </p>
</div>

                                        {ticket.status !== 'CANCELLED' && (
    <div className="d-flex gap-2">
        <button 
            className="btn btn-danger flex-grow-1"
            onClick={() => handleCancelTicket(ticket.ticketId)}
        >
            Cancel Ticket
        </button>
        <button 
            className="btn btn-primary flex-grow-1"
            onClick={() => handleChangeSeat(ticket.ticketId, ticket.flight.flightId)}
        >
            Change Seat
        </button>
    </div>
)}

                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showSeatMap && (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Select New Seat</h5>
                    <button type="button" className="btn-close" onClick={() => setShowSeatMap(false)}></button>
                </div>
                <div className="modal-body">
                    <SeatMap 
                        flightId={selectedFlightId} 
                        onSeatSelect={handleSeatSelect}
                    />
                </div>
                <div className="modal-footer">
                    <button 
                        onClick={() => setShowSeatMap(false)}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
{showConfirmModal && (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Confirm Seat Change</h5>
                    <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body">
                    <p>Change seat to {selectedNewSeat}?</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={confirmSeatChange}>Confirm Change</button>
                </div>
            </div>
        </div>
    </div>
)}

            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default MyTickets;
