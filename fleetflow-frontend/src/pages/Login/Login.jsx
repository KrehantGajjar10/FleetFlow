// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';
import './Login.css'; // Styling remains untouched from our polish phase!

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Dispatcher' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        await axios.post('http://127.0.0.1:8000/auth/register', formData);
        alert("Registration Successful! Please login.");
        setIsRegistering(false);
      } else {
        const response = await axios.post('http://127.0.0.1:8000/auth/login', formData);
        
        // NEW: Save the user data to localStorage so the Sidebar can read it!
        localStorage.setItem('fleetflow_user', JSON.stringify(response.data.user));
        
        navigate('/dashboard'); 
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail); 
      } else {
        setError("Network Error. Is the FastAPI server running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="FleetFlow Logo" className="login-logo" />
          <h1>FleetFlow</h1>
          <p>{isRegistering ? 'Create your account' : 'Sign in to your workspace'}</p>
        </div>

        {/* Display real backend errors here */}
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username / Email</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              name="role" 
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="SafetyOfficer">Safety Officer</option>
              <option value="FinancialAnalyst">Financial Analyst</option>
            </select>
          </div>

          {!isRegistering && (
            <a href="#" className="forgot-password">Forgot Password?</a>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="toggle-register">
          {isRegistering ? (
            <p>Already have an account? <span onClick={() => {setIsRegistering(false); setError('');}}>Login here</span></p>
          ) : (
            <p>Need an account? <span onClick={() => {setIsRegistering(true); setError('');}}>Register</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;