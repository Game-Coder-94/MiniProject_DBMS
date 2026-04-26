import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import ImageModal from '../components/ImageModal';
import '../App.css';

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        // Use relative URL which will be proxied by Vite during dev
        // or will reach the backend directly in production
        const apiUrl = import.meta.env.DEV ? '/api/feed' : 'http://localhost:3000/api/feed';
        
        const response = await axios.get(apiUrl, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
          }
        });

        if (Array.isArray(response.data)) {
          setPins(response.data);
          setError(null);
        } else {
          console.warn("Expected array, but received:", typeof response.data);
          setPins([]);
          setError('Invalid data format from server');
        }
      } catch (err) {
        console.error("Error fetching pins:", err);
        setError(err.message || 'Failed to load the cosmos...');
        setPins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  const openModal = (pin) => {
    setSelectedPin(pin);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPin(null);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-deeper">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-nebula-purple mb-4"></div>
          <p className="text-nebula-purple text-lg font-semibold">Loading the cosmos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-deeper p-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-400 text-lg mb-2">Connection Error</p>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-slate-400 text-sm">Make sure the backend server is running on port 3000</p>
        </div>
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-deeper p-4">
        <div className="text-center">
          <p className="text-slate-300 text-lg">No celestial objects discovered yet</p>
          <p className="text-slate-500 text-sm mt-2">Seed the database to begin your exploration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-deeper p-4 md:p-8 pb-[200px]">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map(pin => (
          <div
            key={pin.pin_id}
            className="pin-card"
            onClick={() => openModal(pin)}
          >
            <div className="pin-image-wrap">
              <img
                src={pin.image_url}
                alt={pin.space_object}
                className="pin-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="280"%3E%3Crect fill="%23223344" width="400" height="280"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23aabbcc" font-size="18"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="pin-badges">
                <span className="pin-badge pin-badge-type">
                  {pin.object_type === 'P' && '🪐 Planet'}
                  {pin.object_type === 'G' && '🌌 Galaxy'}
                  {pin.object_type === 'N' && '🌫️ Nebula'}
                  {!['P', 'G', 'N'].includes(pin.object_type) && `Type: ${pin.object_type}`}
                </span>
                <span className="pin-badge pin-badge-save">Pinned</span>
              </div>
            </div>

            <div className="pin-meta p-4">
              <div>
                <h3 className="pin-title">{pin.space_object}</h3>
                <p className="pin-description">{pin.mission_name || 'Unknown mission'}</p>
              </div>
              <div className="pin-footer">
                <span className="pin-author">@{pin.pinner || 'astro'}</span>
                <button className="pin-action">Save</button>
              </div>
            </div>
          </div>
        ))}
      </Masonry>

      <div className="floating-header feed-floating-header">
        <div className="floating-header-content">
          <div className="floating-header-title-section">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text bg-gradient-to-r from-nebula-purple via-blue-400 to-cyan-300 leading-tight">
              📌 AstroPin
            </h1>
            <p className="text-slate-300 max-w-xl leading-relaxed hidden md:block">Discover and explore NASA's cosmos through pinned imagery, curated into a sleek visual board layout.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="trending-badge">✨ Trending</span>
            <span className="trending-badge">🎨 Space Art</span>
            <span className="trending-badge">🏆 NASA Picks</span>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        pin={selectedPin}
        onClose={closeModal}
      />
    </div>
  );
};

export default Feed;
