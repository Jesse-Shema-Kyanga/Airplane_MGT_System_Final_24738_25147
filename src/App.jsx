import React, { useState } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import PasswordReset from './pages/PasswordReset';
import TwoFactorAuth from './pages/TwoFactorAuth';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }) 
      });

      console.log("Received response:", response);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        // Temporarily store email for 2FA verification
        localStorage.setItem('userEmail', email);
        // Redirect to the 2FA verification page
        navigate('/2fa');
      } else {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        setError(errorData.message || "Failed to log in. Please try again.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="auth-container">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="card shadow-lg">
                  <div className="card-body p-5">
                    <div className="text-center mb-4">
                      <h2>Welcome Back</h2>
                      <p className="text-muted">Sign in to your SkyWings account</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="bi bi-lock"></i></span>
                          <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="remember"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                          />
                          <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        <NavLink to="/forgot-password" className="text-primary">Forgot password?</NavLink>
                      </div>
                      <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
                      
                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="text-center">
                        <span>Don't have an account? </span>
                        <NavLink to="/signup" className="text-primary">Sign Up</NavLink>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      {/* Add your other routes here */}
    </Routes>
  );
};

export default App;
