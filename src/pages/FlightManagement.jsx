import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [airplanes, setAirplanes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(5);

    const initialFormData = {
        flightNumber: '',
        departureLocation: '',
        arrivalLocation: '',
        departureTime: '',
        arrivalTime: '',
        makeNumber: '',
        status: '',
        price: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchFlights();
        fetchAirplanes();
    }, [currentPage]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const fetchFlights = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/flights/all?page=${currentPage}&size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFlights(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            showToastMessage('Error fetching flights');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const makeNumber = formData.makeNumber;
            const url = selectedFlight 
                ? `http://localhost:8080/flights/assign-details-with-make/${selectedFlight.flightId}?makeNumber=${makeNumber}`
                : `http://localhost:8080/flights/create?makeNumber=${makeNumber}`;
    
            const response = await fetch(url, {
                method: selectedFlight ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightNumber: formData.flightNumber,
                    departureLocation: formData.departureLocation,
                    arrivalLocation: formData.arrivalLocation,
                    departureTime: formData.departureTime,
                    arrivalTime: formData.arrivalTime,
                    status: formData.status,
                    price: parseFloat(formData.price)
                })
            });
    
            if (response.ok) {
                showToastMessage(`Flight ${selectedFlight ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                await fetchFlights();
                resetForm();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            showToastMessage('Error processing request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                const response = await fetch(`http://localhost:8080/flights/delete/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToastMessage('Flight deleted successfully');
                    fetchFlights();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showToastMessage('Error deleting flight');
            }
        }
    };

    const handleEdit = (flight) => {
        setSelectedFlight(flight);
        setFormData({
            flightNumber: flight.flightNumber,
            departureLocation: flight.departureLocation,
            arrivalLocation: flight.arrivalLocation,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
            makeNumber: flight.airplane.makeNumber,
            status: flight.status,
            price: flight.price
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedFlight(null);
    };

    const fetchAirplanes = async () => {
        try {
            const response = await fetch('http://localhost:8080/airplanes/good-status');
            if (!response.ok) {
                throw new Error('Failed to fetch airplanes');
            }
            const data = await response.json();
            setAirplanes(data);
        } catch (error) {
            showToastMessage('Error fetching airplanes');
        }
    };

    const PaginationControls = () => (
        <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
                Showing page {currentPage + 1} of {totalPages}
            </div>
            <div className="btn-group">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`btn ${currentPage === index ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentPage(index)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="btn btn-outline-primary"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
    









    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-2 sidebar p-0">
                    <div className="text-center py-4">
                        <h4>SkyWay Airlines</h4>
                        <p>Admin Panel</p>
                    </div>
                    <nav className="nav flex-column">
                        <NavLink className="nav-link" to="/admin">
                            <i className="bi bi-speedometer2"></i> Dashboard
                        </NavLink>
                        <NavLink to="/" className="nav-link mt-auto">
                            <i className="bi bi-box-arrow-right"></i> Logout
                        </NavLink>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="col-md-10 content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Flight Management</h2>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <i className="bi bi-plus-circle"></i> Add New Flight
                        </button>
                    </div>

                    {/* Flight Table */}
                    <div className="card">
    <div className="card-body">
        <div className="table-responsive">
            {isLoading ? (
                <div className="text-center p-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : flights.length === 0 ? (
                <div className="text-center p-3">
                    <p>No flights found. Add a new flight to get started.</p>
                </div>
            ) : (
                <>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Flight Number</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Aircraft</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight) => (
                                <tr key={flight.flightId}>
                                    <td>{flight.flightNumber}</td>
                                    <td>{flight.departureLocation}</td>
                                    <td>{flight.arrivalLocation}</td>
                                    <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                    <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                    <td>${flight.price.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge bg-${flight.status === 'SCHEDULED' ? 'success' : 
                                            flight.status === 'DELAYED' ? 'warning' : 
                                            flight.status === 'CANCELLED' ? 'danger' : 'info'}`}>
                                            {flight.status}
                                        </span>
                                    </td>
                                    <td>{flight.airplane.makeNumber}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => handleEdit(flight)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(flight.flightId)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationControls />
                </>
            )}
        </div>
    </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedFlight ? 'Edit Flight' : 'Add New Flight'}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Flight Number</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.flightNumber}
                                            onChange={(e) => setFormData({...formData, flightNumber: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
    <label className="form-label">Aircraft (Good Status Only)</label>
    <select 
        className="form-select" 
        value={formData.makeNumber}
        onChange={(e) => setFormData({...formData, makeNumber: e.target.value})}
        required 
    >
        <option value="">Select aircraft</option>
        {airplanes.map((airplane) => (
            <option 
                key={airplane.airplaneId} 
                value={airplane.makeNumber}
            >
                {airplane.model} - {airplane.makeNumber} ({airplane.maintenanceStatus})
            </option>
        ))}
    </select>
</div>

                                    <div className="col-md-6">
                                        <label className="form-label">Departure Location</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.departureLocation}
                                            onChange={(e) => setFormData({...formData, departureLocation: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Arrival Location</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.arrivalLocation}
                                            onChange={(e) => setFormData({...formData, arrivalLocation: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Departure Time</label>
                                        <input 
                                            type="datetime-local" 
                                            className="form-control" 
                                            value={formData.departureTime}
                                            onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Arrival Time</label>
                                        <input 
                                            type="datetime-local" 
                                            className="form-control" 
                                            value={formData.arrivalTime}
                                            onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
    <label className="form-label">Price</label>
    <input 
        type="number" 
        step="0.01" 
        className="form-control" 
        value={formData.price}
        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
        required 
    />
</div>
                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <select 
                                            className="form-select" 
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            required
                                        >
                                            <option value="">Select status</option>
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="DELAYED">Delayed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                            <option value="LANDING">Landing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {selectedFlight ? 'Update Flight' : 'Save Flight'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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

export default FlightManagement;
