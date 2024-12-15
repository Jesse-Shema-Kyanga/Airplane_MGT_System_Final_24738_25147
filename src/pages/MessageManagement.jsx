import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { NavLink } from 'react-router';

const MessageManagement = () => {

    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ message: '', senderName: '' });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/message/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showToastMessage('Message sent successfully!');
                setFormData({ message: '', senderName: '' }); // Reset form
                fetchMessages(); // Refresh messages
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showToastMessage('Error sending message: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`http://localhost:8080/message/deleteMessage/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showToastMessage('Message deleted successfully');
                    fetchMessages(); // Refresh messages
                } else {
                    throw new Error('Failed to delete message');
                }
            } catch (error) {
                showToastMessage('Error deleting message: ' + error.message);
            }
        }
    };

  return (
   
    <div className="container mt-5">
    <h2>Message Management</h2>
    <button 
        className="btn btn-primary mb-3" 
        onClick={() => setShowModal(true)}
    >
        <i className="bi bi-envelope-plus"></i> New Message
    </button>

    <NavLink to="/" className="btn btn-danger mb-3 ms-2">
                <i className="bi bi-box-arrow-right"></i> Logout
            </NavLink>

    {/* Message Entry Form */}
    {showModal && (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Sender Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary">
                <i className="bi bi-send"></i> Send Message
            </button>
        </form>
    )}

    {/* Display Messages as Email Containers */}
    <div className="email-container">
        {messages.length === 0 ? (
            <p>No messages found.</p>
        ) : (
            messages.map((message) => (
                <div key={message.id} className="border p-3 mb-3">
                    <small className="text-muted">
                                Sent at: {new Date(message.sentAt).toLocaleString()}
                     </small><br/><br/>
                    <h5>{message.senderName}</h5>
                    <p>{message.message}</p>
                    <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(message.id)}
                    >
                        <i className="bi bi-trash"></i> Delete
                    </button>
                </div>
            ))
        )}
    </div><br/><br/><br/><br/>

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

export default MessageManagement