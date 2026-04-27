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
            <div className="flex items-center gap-2 md:gap-4 ml-1 md:ml-4">
              <Link 
                to="/boards" 
                className={`nav-link ${isActive('/boards') ? 'active' : ''}`}
              >
                🗂️ Boards
              </Link>
              <div className="relative group cursor-pointer ml-2 flex items-center">
                <img 
                  src={user?.profile_image_url || `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=a855f7&color=fff&rounded=true&bold=true`} 
                  alt="Profile" 
                  className="w-11 h-11 rounded-full border-2 border-space-accent object-cover shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute right-0 top-full mt-3 w-56 bg-space-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="p-5 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    <p className="text-white font-bold text-lg truncate drop-shadow-md">{user?.username}</p>
                    <p className="text-slate-400 text-sm truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { localStorage.clear(); window.location.href='/'; }}
                    className="w-full text-left px-5 py-4 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold flex items-center gap-3"
                  >
                    <span className="text-lg">🚪</span> Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''} ml-2`}
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
