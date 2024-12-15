import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';
import SeatMap from '../components/SeatMap';
import "../pages/homeStyles.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const PassengerFlights = () => {
    const [flights, setFlights] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [showSeatMap, setShowSeatMap] = useState(false);
    const [selectedFlightId, setSelectedFlightId] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [sortDirection, setSortDirection] = useState('none');
    
    const [filters, setFilters] = useState({
        departureCity: '',
        arrivalCity: '',
        date: '',
        sortBy: ''
    });

    useEffect(() => {
        fetchFlights();
    }, []);

    const toggleSortDirection = () => {
        const directions = {
            'none': 'asc',
            'asc': 'desc',
            'desc': 'none'
        };
        setSortDirection(prev => directions[prev]);
    };

    const fetchFlights = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/flights/all');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFlights(data.content || []); 
        } catch (error) {
            showToastMessage('Error fetching flights');
            setFlights([]); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getFilteredAndSortedFlights = () => {
        return flights
            .filter(flight => {
                const searchTerm = globalSearch.toLowerCase();
                const matchesGlobal = !globalSearch || 
                    flight.flightNumber.toLowerCase().includes(searchTerm) ||
                    flight.departureLocation.toLowerCase().includes(searchTerm) ||
                    flight.arrivalLocation.toLowerCase().includes(searchTerm) ||
                    flight.status.toLowerCase().includes(searchTerm);

                const matchesFilters = (
                    (filters.departureCity ? flight.departureLocation.toLowerCase().includes(filters.departureCity.toLowerCase()) : true) &&
                    (filters.arrivalCity ? flight.arrivalLocation.toLowerCase().includes(filters.arrivalCity.toLowerCase()) : true) &&
                    (filters.date ? new Date(flight.departureTime).toISOString().split('T')[0] === filters.date : true)
                );

                return matchesGlobal && matchesFilters;
            })
            .sort((a, b) => {
                if (sortDirection === 'none') return 0;
                if (sortDirection === 'asc') return a.price - b.price;
                return b.price - a.price;
            });
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const handleBooking = async (flightId) => {
        setSelectedFlightId(flightId);
        setShowSeatMap(true);
    };

    const handleSeatSelect = (seatNumber) => {
        setSelectedSeat(seatNumber);
    };
    
    const handleBookingConfirm = async () => {
        if (!selectedSeat) return;
        
        const selectedFlight = flights.find(f => f.flightId === selectedFlightId);
        const userEmail = localStorage.getItem('userEmail');
        
        const queryParams = new URLSearchParams({
            email: userEmail,
            flightNumber: selectedFlight.flightNumber
        });
    
        try {
            const response = await fetch(`http://localhost:8080/tickets/book?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    seatNumber: selectedSeat
                })
            });
    
            if (response.ok) {
                showToastMessage('Booking successful!');
                setShowSeatMap(false);
                setSelectedSeat(null);
            } else {
                const errorData = await response.json();
                showToastMessage(errorData.message || 'Booking failed');
            }
        } catch (error) {
            showToastMessage('Error booking flight');
        }
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
                {/* Global Search */}
                <div className="card mb-4">
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search flights by number, location, or status..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Column Filters */}
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Departure City</label>
                                <input 
                                    type="text"
                                    name="departureCity"
                                    className="form-control"
                                    placeholder="From"
                                    value={filters.departureCity}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Arrival City</label>
                                <input 
                                    type="text"
                                    name="arrivalCity"
                                    className="form-control"
                                    placeholder="To"
                                    value={filters.arrivalCity}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Date</label>
                                <input 
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">
                                    Price Sort
                                    <span 
                                        onClick={toggleSortDirection} 
                                        style={{cursor: 'pointer', marginLeft: '10px'}}
                                    >
                                        {sortDirection === 'asc' && <i className="bi bi-arrow-up"/>}
                                        {sortDirection === 'desc' && <i className="bi bi-arrow-down"/>}
                                        {sortDirection === 'none' && <i className="bi bi-arrow-down-up"/>}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Flights List */}
                <div className="row">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : getFilteredAndSortedFlights().length === 0 ? (
                        <div className="text-center">
                            <p>No flights available for the selected criteria.</p>
                        </div>
                    ) : (
                        getFilteredAndSortedFlights().map((flight) => (
                            <div key={flight.flightId} className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title mb-0">Flight {flight.flightNumber}</h5>
                                            <span className={`badge bg-${flight.status === 'SCHEDULED' ? 'success' : 
                                                flight.status === 'DELAYED' ? 'warning' : 
                                                flight.status === 'CANCELLED' ? 'danger' : 'info'}`}>
                                                {flight.status}
                                            </span>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="mb-1"><strong>From:</strong> {flight.departureLocation}</p>
                                                <p><small>{new Date(flight.departureTime).toLocaleString()}</small></p>
                                            </div>
                                            <div className="col-6 text-end">
                                                <p className="mb-1"><strong>To:</strong> {flight.arrivalLocation}</p>
                                                <p><small>{new Date(flight.arrivalTime).toLocaleString()}</small></p>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-12">
                                                <h5 className="text-end text-primary mb-3">
                                                    ${flight.price.toFixed(2)}
                                                </h5>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-primary w-100"
                                            onClick={() => handleBooking(flight.flightId)}
                                            disabled={flight.status === 'CANCELLED'}
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Seat Selection Modal */}
            {showSeatMap && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Your Seat</h5>
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
                                    onClick={handleBookingConfirm}
                                    disabled={!selectedSeat}
                                    className="btn btn-primary"
                                >
                                    Confirm Booking
                                </button>
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

export default PassengerFlights;
