import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


const ScheduleProgram = () => {

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

    useEffect(() => {
        fetchScheduleCrews();
        fetchFlights();
    }, [currentPage]);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
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
                        <p>Crew Member Panel</p>
                    </div>
                    <nav className="nav flex-column">
                        <NavLink to="/" className="nav-link mt-auto">
                            <i className="bi bi-box-arrow-right"></i> Logout
                        </NavLink>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="col-md-10 content p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Crew Members Assigned to flight's List</h2>
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
                                                    <th>Departure Location</th>
                                                    <th>Departure Time</th>
                                                    <th>Captain Pilot</th>
                                                    <th>Co-Pilot</th>
                                                    <th>Flight Attendant 1</th>
                                                    <th>Flight Attendant 2</th>
                                                    <th>Flight Attendant 3</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scheduleCrews.map((crew) => (
                                                    <tr key={crew.scheduleId}>
                                                        <td>{crew.flight.flightNumber}</td>
                                                        <td>{crew.flight.departureLocation}</td>
                                                        <td>{new Date(crew.flight.departureTime).toLocaleString()}</td>
                                                        <td>{`${crew.pilot1.name}`}</td>
                                                        <td>{`${crew.pilot2.name}`}</td>
                                                        <td>{`${crew.flightAttendant1.name}`}</td>
                                                        <td>{`${crew.flightAttendant2.name}`}</td>
                                                        <td>{`${crew.flightAttendant3.name}`}</td>
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

export default ScheduleProgram