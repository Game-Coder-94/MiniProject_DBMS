import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('astro_token');

  useEffect(() => {
    // Redirect authenticated users to the feed
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-container">
      <div className="landing-background"></div>
      <div className="landing-aurora-wrapper">
        <Aurora
          colorStops={["#a855f7", "#3b82f6", "#60a5fa"]}
          blend={0.5}
          amplitude={1.2}
          speed={0.5}
        />
      </div>

      <main className="hero-section">
        <div className="hero-badge">
          <span>🚀</span> AstroPin v1.0 is Live
        </div>
        <h1 className="hero-title">
          Discover the Cosmos,<br />One Pin at a Time.
        </h1>
        <p className="hero-subtitle">
          Explore breathtaking celestial imagery directly from the NASA API. 
          Curate your own stellar collections, track deep space missions, and 
          share the beauty of the universe.
        </p>
        
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary">
            Join the Mission ✦
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            Explore NASA API
          </Link>
        </div>
      </main>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">🔭</div>
            <h3 className="feature-title">Explore Deep Space</h3>
            <p className="feature-desc">
              Tap into NASA's massive image and video library. Search for galaxies, 
              planets, rovers, and nebulae using advanced queries and immediately see stunning results.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">📌</div>
            <h3 className="feature-title">Pin & Collect</h3>
            <p className="feature-desc">
              Found a breathtaking image of the Orion Nebula? Pin it instantly to your 
              personal feed. Build a massive personal collection of the finest space imagery.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">🗂️</div>
            <h3 className="feature-title">Curate Boards</h3>
            <p className="feature-desc">
              Organize your discoveries into beautiful, customized boards. Keep your 
              Mars Rover pictures separate from your James Webb Space Telescope deep fields.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
