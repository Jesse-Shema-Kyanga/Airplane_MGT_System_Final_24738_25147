import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';
import "../styles/airplane.css";

const AirplaneManagement = () => {

    const [airplanes, setAirplanes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAirplane, setSelectedAirplane] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(5);

    const initialFormData = {
        model: '',
        manufacturer: '',
        capacity: '',
        makeNumber: '',
        yearOfManufacture: '',
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
        totalSeats: '',
        seatsPerRow: '',
        maintenanceStatus: '',
        operationalIssues: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchAirplanes();
    }, [currentPage]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const fetchAirplanes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/airplanes/getAll?page=${currentPage}&size=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAirplanes(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            showToastMessage('Error fetching airplanes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const options = {
                method: selectedAirplane ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            };

            const url = selectedAirplane 
                ? `http://localhost:8080/airplanes/update/${selectedAirplane.airplaneId}`
                : 'http://localhost:8080/airplanes/save';

            const response = await fetch(url, options);
            
            if (response.ok) {
                showToastMessage(`Airplane ${selectedAirplane ? 'updated' : 'saved'} successfully`);
                setShowModal(false);
                await fetchAirplanes();
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
        if (window.confirm('Are you sure you want to delete this airplane?')) {
            try {
                const response = await fetch(`http://localhost:8080/airplanes/delete/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToastMessage('Airplane deleted successfully');
                    fetchAirplanes();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showToastMessage('Error deleting airplane');
            }
        }
    };

    const handleEdit = (airplane) => {
        setSelectedAirplane(airplane);
        setFormData({
            model: airplane.model,
            manufacturer: airplane.manufacturer,
            capacity: airplane.capacity,
            makeNumber: airplane.makeNumber,
            yearOfManufacture: airplane.yearOfManufacture,
            lastMaintenanceDate: airplane.lastMaintenanceDate,
            nextMaintenanceDate: airplane.nextMaintenanceDate,
            totalSeats: airplane.totalSeats,
            seatsPerRow: airplane.seatsPerRow,
            maintenanceStatus: airplane.maintenanceStatus,
            operationalIssues: airplane.operationalIssues
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedAirplane(null);
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
                <h2>Airplane Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    <i className="bi bi-plus-circle"></i> Add New Airplane
                </button>
            </div>

            {/* Airplane Table */}
            <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                {isLoading ? (
                                    <div className="text-center p-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : airplanes.length === 0 ? (
                                    <div className="text-center p-3">
                                        <p>No airplanes found. Add a new airplane to get started.</p>
                                    </div>
                                ) : (
                                    <>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Model</th>
                                                    <th>Manufacturer</th>
                                                    <th>Make Number</th>
                                                    <th>Capacity</th>
                                                    <th>Maintenance Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {airplanes.map((airplane) => (
                                                    <tr key={airplane.airplaneId}>
                                                        <td>{airplane.model}</td>
                                                        <td>{airplane.manufacturer}</td>
                                                        <td>{airplane.makeNumber}</td>
                                                        <td>{airplane.capacity}</td>
                                                        <td>
                                                            <span className={`badge status-badge ${airplane.maintenanceStatus}`}>
                                                                {airplane.maintenanceStatus}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button 
                                                                className="btn btn-sm btn-info me-2"
                                                                onClick={() => handleEdit(airplane)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDelete(airplane.airplaneId)}
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
                        {selectedAirplane ? 'Edit Airplane' : 'Add New Airplane'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Model</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={formData.model}
                                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Manufacturer</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={formData.manufacturer}
                                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Make Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={formData.makeNumber}
                                    onChange={(e) => setFormData({...formData, makeNumber: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Capacity</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Year of Manufacture</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={formData.yearOfManufacture}
                                    onChange={(e) => setFormData({...formData, yearOfManufacture: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Last Maintenance Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={formData.lastMaintenanceDate}
                                    onChange={(e) => setFormData({...formData, lastMaintenanceDate: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Next Maintenance Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={formData.nextMaintenanceDate}
                                    onChange={(e) => setFormData({...formData, nextMaintenanceDate: e.target.value})}
                                    required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Total Seats</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={formData.totalSeats}
                                        onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Seats Per Row</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={formData.seatsPerRow}
                                        onChange={(e) => setFormData({...formData, seatsPerRow: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Maintenance Status</label>
                                    <select 
                                        className="form-select" 
                                        value={formData.maintenanceStatus}
                                        onChange={(e) => setFormData({...formData, maintenanceStatus: e.target.value})}
                                        required
                                    >
                                        <option value="">Select status</option>
                                        <option value="GOOD">Good</option>
                                        <option value="LIGHT_MAINTENANCE_REQUIRED">Light Maintenance Required</option>
                                        <option value="HEAVY_MAINTENANCE_REQUIRED">Heavy Maintenance Required</option>
                                        <option value="RETIRED">Retired</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Operational Issues</label>
                                    <textarea 
                                        className="form-control" 
                                        value={formData.operationalIssues}
                                        onChange={(e) => setFormData({...formData, operationalIssues: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {selectedAirplane ? 'Update Airplane' : 'Save Airplane'}
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
  )
}

export default AirplaneManagement