import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2 className="nav-title">AstroPin</h2>
          <p className="nav-subtitle">Explore NASA's Cosmos</p>
        </div>
        
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            📌 Feed
          </Link>
          <Link
            to="/explore"
            className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
          >
            🔭 Explore NASA
          </Link>
          <Link
            to="/login"
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            🔑 Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
