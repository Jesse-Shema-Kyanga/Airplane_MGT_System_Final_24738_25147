import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token && isEmailSent) {
      navigate('/');
    }
  }, [token, isEmailSent, navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setIsEmailSent(true);
        setMessage('Password reset link sent to your email!');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(data.message || 'Password reset failed');
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
                  <h2>{token ? 'Reset Password' : 'Forgot Password'}</h2>
                  <p className="text-muted">{token ? 'Enter your new password' : 'Enter your email to reset your password'}</p>
                </div>
                <form onSubmit={token ? handlePasswordSubmit : handleEmailSubmit}>
                  {token ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : token ? 'Reset Password' : 'Send Reset Link'}
                  </button>
                  {message && (
                    <div className={`alert ${message.includes('successful') || message.includes('sent') ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}
                  {!token && (
                    <div className="text-center">
                      <span>Remember your password? </span>
                      <a href="/login" className="text-primary">Login</a>
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

export default PasswordReset;
