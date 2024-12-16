import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TwoFactorAuth = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/users/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('2FA verification successful!');
        localStorage.setItem('token', data.token);

        // Redirect based on user role
        switch (data.role) {
          case 'ADMIN':
            navigate('/admin');
            break;
          case 'PILOT':
            navigate('/pilot-dashboard');
            break;
          case 'COPILOT':
            navigate('/copilot-dashboard');
            break;
          case 'FLIGHT_ATTENDANT':
            navigate('/flight-attendant-dashboard');
            break;
          case 'PASSENGER':
            navigate('/home');
            break;
          case 'MAINTENANCE_STAFF':
            navigate('/maintenance-page');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        setMessage(data.message || 'Invalid or expired 2FA code');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2>Two-Factor Authentication</h2>
                  <p className="text-muted">Enter the 2FA code sent to your email</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">2FA Code</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-lock"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  {message && (
                    <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
