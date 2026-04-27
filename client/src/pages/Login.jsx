import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import '../App.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.DEV ? '/api/auth/login' : 'http://localhost:3000/api/auth/login';
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier, password } : { username: identifier, password };
      
      const response = await axios.post(apiUrl, payload);
      localStorage.setItem('astro_token', response.data.token);
      localStorage.setItem('astro_user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-stardust"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">AstroLogin</h1>
          <p className="auth-subtitle">Enter your credentials to explore the cosmos</p>
          {error && <p className="auth-error">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="identifier">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-input"
              placeholder="astronaut_2026 or email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Launch 🚀
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up for access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
