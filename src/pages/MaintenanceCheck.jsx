import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';

const MaintenanceCheck = () => {

    const [messages, setMessages] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:8080/message/getAllMessages');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            showToastMessage('Error fetching messages');
        }
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };


  return (
    
    <div className="container-fluid">
            <div className="row">
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
                <div className="col-md-10">
                    <div className="container mt-5">
                        <h2 className="mb-4">Maintenance Check - Received Messages</h2>

                        {/* Display Messages as Email Containers */}
                        <div className="email-container">
    {messages.length === 0 ? (
        <p>No messages found.</p>
    ) : (
        messages.map((message) => (
            <div key={message.id} className="border rounded p-3 mb-3 shadow-sm hover-effect" 
                 style={{ 
                     background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                     transition: 'all 0.3s ease'
                 }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="message-icon me-3">
                            <i className="bi bi-envelope-fill text-primary fs-4"></i>
                        </div>
                        <div>
                            <h5 className="mb-0 text-primary">{message.senderName}</h5>
                            <small className="text-muted">
                                Sent at: {new Date(message.sentAt).toLocaleString()}
                            </small>
                        </div>
                    </div>
                    <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(message.id)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
                <div className="mt-3 ps-5">
                    <p className="mb-0" style={{ lineHeight: '1.6' }}>{message.message}</p>
                </div>
            </div>
        ))
    )}
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
                </div>
            </div>
        </div>


  )
}

export default MaintenanceCheck