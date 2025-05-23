import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import adminImage from '../assets/adminlogin.jpg'; // Make sure this path is correct
import employeeImage from '../assets/userlogin.jpg';

function Login({ setUser }) {
  const [form, setForm] = useState({ 
    username: '', 
    password: '',
    userType: 'employee' // Default to employee login
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector('.login-container').classList.add('animate-in');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username: form.username,
        password: form.password,
        userType: form.userType
      });
      
      if (res.data.success) {
        const user = res.data.user;
        
        // Validate that the user is logging in from the correct side
        if ((form.userType === 'admin' && user.role !== 'admin') || 
            (form.userType === 'employee' && user.role === 'admin')) {
          setError(`Please login from the ${user.role} side`);
          document.querySelector('.login-form').classList.add('shake');
          setTimeout(() => {
            document.querySelector('.login-form').classList.remove('shake');
          }, 500);
          return;
        }

        setUser(user);

        document.querySelector('.login-container').classList.add('animate-out');
        
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        }, 500);
      } else {
        setError('Invalid credentials');
        document.querySelector('.login-form').classList.add('shake');
        setTimeout(() => {
          document.querySelector('.login-form').classList.remove('shake');
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      document.querySelector('.login-form').classList.add('shake');
      setTimeout(() => {
        document.querySelector('.login-form').classList.remove('shake');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const switchUserType = (type) => {
    setForm({ ...form, userType: type, username: '', password: '' });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      
      <div className="login-container">
        <div className="login-switcher">
          <button 
            className={`switch-btn ${form.userType === 'employee' ? 'active' : ''}`}
            onClick={() => switchUserType('employee')}
          >
            Employee Login
          </button>
          <button 
            className={`switch-btn ${form.userType === 'admin' ? 'active' : ''}`}
            onClick={() => switchUserType('admin')}
          >
            Admin Login
          </button>
        </div>
        
        <div className="login-form">
          <div className="login-header">
            <h2>{form.userType === 'admin' ? 'Admin Portal' : 'Employee Portal'}</h2>
            <p>Please login to your {form.userType} account</p>
          </div>
          
          {error && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">
                {form.userType === 'admin' ? 'Admin Username' : 'Employee ID'}
              </label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder={form.userType === 'admin' ? 'Enter admin username' : 'Enter employee ID'}
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6zm0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5 9.77 9.77 0 0 1-8.82 5.5A9.77 9.77 0 0 1 3.18 11.5 9.77 9.77 0 0 1 12 6zm0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="forgot-password">
              <a href="/forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                `Login as ${form.userType}`
              )}
            </button>
          </form>
        </div>
        
        <div className={`login-illustration ${form.userType}`}>
          <div className="illustration-container">
            {form.userType === 'admin' ? (
              <img 
                src={adminImage} 
                alt="Admin Illustration"
                className="login-image"
              />
            ) : (
              <img 
                src={employeeImage} 
                alt="Employee Illustration"
                className="login-image"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;