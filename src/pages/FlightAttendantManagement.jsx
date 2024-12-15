import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';
import "../styles/pilot.css";

const FlightAttendantManagement = () => {
    const [flightAttendants, setFlightAttendants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFlightAttendant, setSelectedFlightAttendant] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(5);

    const initialFormData = {
        name: '',
        dateOfBirth: '',
        yearsOfExperience: '',
        phone: '',
        email: '',
        status: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchFlightAttendants();
    }, [currentPage]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const fetchFlightAttendants = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/flight-attendant/getAllFlightAttendants?page=${currentPage}&size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFlightAttendants(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            showToastMessage('Error fetching flight attendants');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const options = {
                method: selectedFlightAttendant ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            };

            const url = selectedFlightAttendant 
                ? `http://localhost:8080/flight-attendant/updateFlightAttendant/${selectedFlightAttendant.flightAttendantId}`
                : 'http://localhost:8080/flight-attendant/saveFlightAttendant';

            const response = await fetch(url, options);
            
            if (response.ok) {
                showToastMessage(`Flight Attendant ${selectedFlightAttendant ? 'updated' : 'saved'} successfully`);
                setShowModal(false);
                await fetchFlightAttendants();
                resetForm();
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            showToastMessage('Error processing request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight attendant?')) {
            try {
                const response = await fetch(`http://localhost:8080/flight-attendant/deleteFlightAttendant/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToastMessage('Flight Attendant deleted successfully');
                    fetchFlightAttendants();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showToastMessage('Error deleting flight attendant');
            }
        }
    };

    const handleEdit = (flightAttendant) => {
        setSelectedFlightAttendant(flightAttendant);
        setFormData({
            name: flightAttendant.name,
            dateOfBirth: flightAttendant.dateOfBirth,
            yearsOfExperience: flightAttendant.yearsOfExperience,
            phone: flightAttendant.phone,
            email: flightAttendant.email,
            status: flightAttendant.status
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedFlightAttendant(null);
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
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
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
                        <h2>Flight Attendant Management</h2>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <i className="bi bi-plus-circle"></i> Add New Flight Attendant
                        </button>
                    </div>

                    {/* Flight Attendant Table */}
                    <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        {isLoading ? (
                            <div className="text-center p-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : flightAttendants.length === 0 ? (
                            <div className="text-center p-3">
                                <p>No flight attendants found. Add a new flight attendant to get started.</p>
                            </div>
                        ) : (
                            <>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Experience</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flightAttendants.map((flightAttendant) => (
                                            <tr key={flightAttendant.flightAttendantId}>
                                                <td>{flightAttendant.name}</td>
                                                <td>{flightAttendant.yearsOfExperience} years</td>
                                                <td>
                                                    <span className={`badge status-badge ${flightAttendant.status}`}>
                                                        {flightAttendant.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-info me-2"
                                                        onClick={() => handleEdit(flightAttendant)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(flightAttendant.flightAttendantId)}
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
                                {selectedFlightAttendant ? 'Edit Flight Attendant' : 'Add New Flight Attendant'}
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="name" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            className="form-control" 
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Years of Experience</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            name="yearsOfExperience"
                                            value={formData.yearsOfExperience}
                                            onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            name="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <select 
                                            className="form-select" 
                                            name="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                            required
                                        >
                                            <option value="">Select status</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                            <option value="ON_LEAVE">On Leave</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {selectedFlightAttendant ? 'Update Flight Attendant' : 'Save Flight Attendant'}
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

export default FlightAttendantManagement;
