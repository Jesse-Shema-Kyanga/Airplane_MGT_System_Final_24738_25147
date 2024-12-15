import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import "../pages/adminStyles.css";

const Admin = () => {

    const [totalAirplanes, setTotalAirplanes] = useState(0);
    const [activePilots, setActivePilots] = useState(0);
    const [activeFlightAttendants, setActiveFlightAttendants] = useState(0);
    const [todaysFlights, setTodaysFlights] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    useEffect(() => {
        const fetchTotalAirplanes = async () => {
            try {
                const response = await fetch('http://localhost:8080/airplanes/count'); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const count = await response.json();
                setTotalAirplanes(count);
            } catch (error) {
                console.error('Error fetching total airplanes:', error);
            }
        };

        const fetchActivePilots = async () => {
            try {
                const response = await fetch('http://localhost:8080/pilot/countActive'); // Fetch active pilots count
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const count = await response.json();
                setActivePilots(count); // Set the active pilots count
            } catch (error) {
                console.error('Error fetching active pilots:', error);
            }
        };

        const fetchActiveFlightAttendants = async () => {
            try {
                const response = await fetch('http://localhost:8080/flight-attendant/countActiveFlightAttendant'); // Fetch active flight attendants count
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const count = await response.json();
                setActiveFlightAttendants(count); // Set the active flight attendants count
            } catch (error) {
                console.error('Error fetching active flight attendants:', error);
            }
        };

        const fetchTodaysFlights = async () => {
            try {
                const response = await fetch('http://localhost:8080/flights/countFlightsToday'); // Fetch today's flights count
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const count = await response.json();
                setTodaysFlights(count); // Set the today's flights count
            } catch (error) {
                console.error('Error fetching today\'s flights:', error);
            }
        };

        const fetchMessageCount = async () => {
            try {
                const response = await fetch('http://localhost:8080/message/count');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const count = await response.json();
                setMessageCount(count); // Set the message count
            } catch (error) {
                console.error('Error fetching message count:', error);
            }
        };

        fetchTotalAirplanes();
        fetchActivePilots(); 
        fetchActiveFlightAttendants(); 
        fetchTodaysFlights(); 
        fetchMessageCount(); 
    }, []);


  return (
    <div>
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-2 sidebar p-0">
                <div className="text-center py-4">
                    <h4>SkyWay Airlines</h4>
                    <p>Admin Panel</p>
                </div>
                <nav className="nav flex-column">
                    <NavLink to="/admin" className="nav-link active">
                        <i className="bi bi-speedometer2"></i> Dashboard
                    </NavLink>
                    <NavLink to="/airplane-management" className="nav-link"><i className="bi bi-airplane"></i> Airplanes</NavLink>
                    <NavLink to="/pilotManagement" className="nav-link">
                        <i className="bi bi-person"></i> Pilots
                    </NavLink>
                    <NavLink to="/flight-attendant" className="nav-link"><i className="bi bi-people"></i> Flight Attendant</NavLink>
                    <NavLink to="/flightManagement" className="nav-link">
                        <i className="bi bi-calendar"></i> Flights
                    </NavLink>
                    <NavLink to="/schedule-crew" className="nav-link"><i className="bi bi-people"></i> Schedule Crew flight</NavLink>
                    <NavLink to="/" className="nav-link"><i className="bi bi-box-arrow-right"></i> Logout</NavLink>
                </nav>
            </div>

            
            <div className="col-md-10 content p-4">
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h2>Dashboard Overview</h2>
                    </div>
                </div>

                
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary card-hover">
                            <div className="card-body">
                                <h5 className="card-title">Total Airplanes</h5>
                                <h2>{totalAirplanes}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success card-hover">
                            <div className="card-body">
                                <h5 className="card-title">Active Pilots</h5>
                                <h2>{activePilots}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-info card-hover">
                            <div className="card-body">
                                <h5 className="card-title">Flight Attendants</h5>
                                <h2>{activeFlightAttendants}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-warning card-hover">
                            <div className="card-body">
                                <h5 className="card-title">Today's Flights</h5>
                                <h2>{todaysFlights}</h2>
                            </div>
                        </div>
                    </div>
                </div>

              
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Quick Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <NavLink to="/flightManagement" className="btn btn-primary" type="NavLink">Add New Flight</NavLink>
                                    <NavLink to="/schedule-crew" className="btn btn-success" type="NavLink">Schedule Crew</NavLink>
                                    <NavLink to="/maintenance-check" className="btn btn-dark text-white" type="NavLink">
                                <i className="bi bi-tools"></i> Maintenance Check 
                                {messageCount > 0 && <span className="badge bg-danger ms-2">{messageCount}</span>} {/* Display message count */}
                            </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Recent Activities</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">New pilot assigned to Flight AX-447</li>
                                    <li className="list-group-item">Maintenance completed for Boeing 737</li>
                                    <li className="list-group-item">Crew schedule updated for next week</li>
                                    <li className="list-group-item">New flight route added: NYC to LAX</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  )
}

export default Admin