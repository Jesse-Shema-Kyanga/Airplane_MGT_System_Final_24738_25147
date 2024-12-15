import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from fullName to name
    email: "",
    password: "",
    confirmPassword: "",
    passportNumber: "",
    dateOfBirth: "",
    role: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
    }

    const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passportNumber: formData.passportNumber,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        phone: formData.phone,
    };

    try {
        const response = await fetch("http://localhost:8080/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
            setSuccessMessage(responseData.message || "Account created successfully!");
            setErrorMessage("");
            setFormData({});
        } else if (response.status === 409) {
            setErrorMessage(responseData.message || "User with the provided email or passport number already exists");
            setSuccessMessage("");
        } else {
            setErrorMessage(responseData.message || "Failed while creating the account.");
            setSuccessMessage("");
        }
    } catch (error) {
        setErrorMessage("An error occurred while creating the account.");
        setSuccessMessage("");
    }
};


  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2>Create Account</h2>
                  <p className="text-muted">Join SkyWings for exclusive benefits</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-person"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Email address</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-phone"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-lock"></i></span>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Passport Number */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Passport Number</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-card"></i></span>
                        <input
                          type="text"
                          className="form-control"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Date of Birth</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="PILOT">PILOT</option>
                        <option value="COPILOT">COPILOT</option>
                        <option value="FLIGHT_ATTENDANT">FLIGHT ATTENDANT</option>
                        <option value="PASSENGER">PASSENGER</option>
                        <option value="MAINTENANCE_STAFF">MAINTENANCE STAFF</option>
                      </select>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="col-12 mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="terms"
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <NavLink className="text-primary">Terms & Conditions</NavLink>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>

                  {/* Display success or error message */}
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  {successMessage && <div className="alert alert-success">{successMessage}</div>}

                  <div className="text-center">
                    <span>Already have an account? </span>
                    <NavLink to="/" className="text-primary">Sign In</NavLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
