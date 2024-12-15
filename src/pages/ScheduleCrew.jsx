import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';


const ScheduleCrew = () => {

    const [scheduleCrews, setScheduleCrews] = useState([]);
    const [flights, setFlights] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedScheduleCrew, setSelectedScheduleCrew] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(5);
    const [seniorPilots, setSeniorPilots] = useState([]);
    const [juniorPilots, setJuniorPilots] = useState([]);
    const [juniorAttendants, setJuniorAttendants] = useState([]);
    const [midLevelAttendants, setMidLevelAttendants] = useState([]);
    const [seniorAttendants, setSeniorAttendants] = useState([]);

    const initialFormData = {
        flightId: '',
        pilot1Id: '',
        pilot2Id: '',
        flightAttendant1Id: '',
        flightAttendant2Id: '',
        flightAttendant3Id: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchScheduleCrews();
        fetchFlights();
        fetchSeniorPilots();
        fetchJuniorPilots();
        fetchAttendantsByLevel();
    }, [currentPage]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const fetchScheduleCrews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/schedule-crews/all?page=${currentPage}&size=${itemsPerPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setScheduleCrews(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            showToastMessage('Error fetching schedule crews');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await fetch('http://localhost:8080/flights/all');
            if (!response.ok) throw new Error('Failed to fetch flights');
            const data = await response.json();
            setFlights(data.content);
        } catch (error) {
            showToastMessage('Error fetching flights');
        }
    };

    const fetchSeniorPilots = async () => {
        try {
            const response = await fetch('http://localhost:8080/pilot/senior');
            if (!response.ok) throw new Error('Failed to fetch senior pilots');
            const data = await response.json();
            setSeniorPilots(data);
        } catch (error) {
            showToastMessage('Error fetching senior pilots');
        }
    };

    const fetchJuniorPilots = async () => {
        try {
            const response = await fetch('http://localhost:8080/pilot/junior');
            if (!response.ok) throw new Error('Failed to fetch junior pilots');
            const data = await response.json();
            setJuniorPilots(data);
        } catch (error) {
            showToastMessage('Error fetching junior pilots');
        }
    };

    const fetchAttendantsByLevel = async () => {
        try {
            const [juniorRes, midRes, seniorRes] = await Promise.all([
                fetch('http://localhost:8080/flight-attendant/junior'),
                fetch('http://localhost:8080/flight-attendant/mid-level'),
                fetch('http://localhost:8080/flight-attendant/senior')
            ]);

            const juniorData = await juniorRes.json();
            const midData = await midRes.json();
            const seniorData = await seniorRes.json();

            setJuniorAttendants(juniorData);
            setMidLevelAttendants(midData);
            setSeniorAttendants(seniorData);
        } catch (error) {
            showToastMessage('Error fetching flight attendants');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare the URL for saving or updating
        const url = selectedScheduleCrew 
            ? `http://localhost:8080/schedule-crews/updateSchedule/${selectedScheduleCrew.scheduleCrewId}`
            : 'http://localhost:8080/schedule-crews/saveSchedule';
    
        // Create the payload for the request
        const payload = {
            flight: { flightId: formData.flightId }, // Ensure flight is set
            pilot1: { pilotId: formData.pilot1Id },
            pilot2: { pilotId: formData.pilot2Id },
            flightAttendant1: { flightAttendantId: formData.flightAttendant1Id },
            flightAttendant2: { flightAttendantId: formData.flightAttendant2Id },
            flightAttendant3: { flightAttendantId: formData.flightAttendant3Id }
        };
    
        try {
            const response = await fetch(url, {
                method: selectedScheduleCrew ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload), // Send the payload
            });
    
            if (response.ok) {
                showToastMessage(`Schedule crew ${selectedScheduleCrew ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                await fetchScheduleCrews();
                resetForm();
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to save schedule crew: ${errorText}`);
            }
        } catch (error) {
            showToastMessage('Error processing request');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule crew?')) {
            try {
                const response = await fetch(`http://localhost:8080/schedule-crews/delete/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToastMessage('Schedule crew deleted successfully');
                    fetchScheduleCrews();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                showToastMessage('Error deleting schedule crew');
            }
        }
    };

    const handleEdit = (scheduleCrew) => {
        setSelectedScheduleCrew(scheduleCrew);
        setFormData({
            flightId: scheduleCrew.flight.flightId,
            pilot1Id: scheduleCrew.pilot1.pilotId, // Fixed property name
            pilot2Id: scheduleCrew.pilot2.pilotId, // Fixed property name
            flightAttendant1Id: scheduleCrew.flightAttendant1.flightAttendantId, // Fixed property name
            flightAttendant2Id: scheduleCrew.flightAttendant2.flightAttendantId, // Fixed property name
            flightAttendant3Id: scheduleCrew.flightAttendant3.flightAttendantId // Fixed property name
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedScheduleCrew(null);
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
                <h2>Schedule Crew Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    <i className="bi bi-plus-circle"></i> Add New Schedule
                </button>
            </div>

            {/* Schedule Crew Table */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        {isLoading ? (
                            <div className="text-center p-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : scheduleCrews.length === 0 ? (
                            <div className="text-center p-3">
                                <p>No schedule crews found. Add a new schedule to get started.</p>
                            </div>
                        ) : (
                            <>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Flight Number</th>
                                            <th>Captain Pilot</th>
                                            <th>Co-Pilot</th>
                                            <th>Flight Attendant 1</th>
                                            <th>Flight Attendant 2</th>
                                            <th>Flight Attendant 3</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scheduleCrews.map((crew) => (
                                            <tr key={crew.scheduleCrewId}>
                                                <td>{crew.flight.flightNumber}</td>
                                                <td>{crew.pilot1.name}</td>
                                                <td>{crew.pilot2.name}</td>
                                                <td>{crew.flightAttendant1.name}</td>
                                                <td>{crew.flightAttendant2.name}</td>
                                                <td>{crew.flightAttendant3.name}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-info me-2"
                                                        onClick={() => handleEdit(crew)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(crew.scheduleCrewId)}
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
                        {selectedScheduleCrew ? 'Edit Schedule Crew' : 'Add New Schedule Crew'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label className="form-label">Flight</label>
                                <select 
                                    className="form-select"
                                    value={formData.flightId}
                                    onChange={(e) => setFormData({...formData, flightId: e.target.value})}
                                    required
                                >
                                    <option value="">Select flight</option>
                                    {flights.map((flight) => (
                                        <option key={flight.flightId} value={flight.flightId}>
                                            {flight.flightNumber} - {flight.departureLocation} to {flight.arrivalLocation}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Pilot 1 (Senior)</label>
                                <select 
                                    className="form-select"
                                    value={formData.pilot1Id}
                                    onChange={(e) => setFormData({...formData, pilot1Id: e.target.value})}
                                    required
                                >
                                    <option value="">Select senior pilot</option>
                                    {seniorPilots.map((pilot) => (
                                        <option key={pilot.pilotId} value={pilot.pilotId}>
                                            {pilot.name} ({pilot.yearsOfExperience} years)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Pilot 2 (Junior)</label>
                                <select 
                                    className="form-select"
                                    value={formData.pilot2Id}
                                    onChange={(e) => setFormData({...formData, pilot2Id: e.target.value})}
                                    required
                                >
                                    <option value="">Select junior pilot</option>
                                    {juniorPilots.map((pilot) => (
                                        <option key={pilot.pilotId} value={pilot.pilotId}>
                                            {pilot.name} ({pilot.yearsOfExperience} years)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Flight Attendant 1 (Junior)</label>
                                <select 
                                    className="form-select"
                                    value={formData.flightAttendant1Id}
                                    onChange={(e) => setFormData({...formData, flightAttendant1Id: e.target.value})}
                                    required
                                >
                                    <option value="">Select junior attendant</option>
                                    {juniorAttendants.map((attendant) => (
                                        <option key={attendant.flightAttendantId} value={attendant.flightAttendantId}>
                                            {attendant.name} ({attendant.yearsOfExperience} years)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Flight Attendant 2 (Mid-Level)</label>
                                <select 
                                    className="form-select"
                                    value={formData.flightAttendant2Id}
                                    onChange={(e) => setFormData({...formData, flightAttendant2Id: e.target.value})}
                                    required
                                >
                                    <option value="">Select mid-level attendant</option>
                                    {midLevelAttendants.map((attendant) => (
                                        <option key={attendant.flightAttendantId} value={attendant.flightAttendantId}>
                                            {attendant.name} ({attendant.yearsOfExperience} years)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Flight Attendant 3 (Senior)</label>
                                <select 
                                    className="form-select"
                                    value={formData.flightAttendant3Id}
                                    onChange={(e) => setFormData({...formData, flightAttendant3Id: e.target.value})}
                                    required
                                >
                                    <option value="">Select senior attendant</option>
                                    {seniorAttendants.map((attendant) => (
                                        <option key={attendant.flightAttendantId} value={attendant.flightAttendantId}>
                                            {attendant.name} ({attendant.yearsOfExperience} years)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {selectedScheduleCrew ? 'Update Schedule' : 'Save Schedule'}
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

export default ScheduleCrew