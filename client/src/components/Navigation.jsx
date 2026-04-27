import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('astro_token');
  const userStr = localStorage.getItem('astro_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const isActive = (path) => location.pathname === path;

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
          {isAuthenticated ? (
            <div className="nav-links-auth">
              <Link 
                to="/boards" 
                className={`nav-link ${isActive('/boards') ? 'active' : ''}`}
              >
                🗂️ Boards
              </Link>
              <div className="user-dropdown-wrapper">
                <img 
                  src={user?.profile_image_url || `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=a855f7&color=fff&rounded=true&bold=true`} 
                  alt="Profile" 
                  className="user-avatar"
                />
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-username">{user?.username}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { localStorage.clear(); window.location.href='/'; }}
                    className="dropdown-action"
                  >
                    <span className="dropdown-action-icon">🚪</span> Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              🔑 Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
