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
  const [savingPin, setSavingPin] = useState(null);
  const [boards, setBoards] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSaveClick = async (pin) => {
    const token = localStorage.getItem('astro_token');
    if (!token) {
        alert('Please log in to save pins.');
        return;
    }
    setSavingPin(pin);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
        const apiUrl = import.meta.env.DEV ? '/api/boards' : 'http://localhost:3000/api/boards';
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBoards(response.data);
    } catch (err) {
        setSaveError('Could not load your boards');
    }
  };

  const savePinToBoard = async (boardId) => {
    try {
        const token = localStorage.getItem('astro_token');
        const apiUrl = import.meta.env.DEV ? '/api/boards/save' : 'http://localhost:3000/api/boards/save';
        await axios.post(apiUrl, { board_id: boardId, pin_id: savingPin.pin_id }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSaveSuccess(true);
        setTimeout(() => setSavingPin(null), 1500);
    } catch (err) {
        setSaveError('Failed to save pin to board. It might already exist!');
    }
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
                <button className="pin-action" onClick={(e) => { e.stopPropagation(); handleSaveClick(pin); }}>Save</button>
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

      {/* Save to Board Modal */}
      {savingPin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-space-dark border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-nebula-purple to-cyan-300 font-bold mb-6">Save to Board</h2>
            <div className="flex gap-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img src={savingPin.image_url} alt="Pin preview" className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-white font-bold truncate">{savingPin.space_object}</h3>
                    <p className="text-slate-400 text-sm truncate">{savingPin.mission_name || 'NASA Cosmos'}</p>
                </div>
            </div>
            
            {saveError && <p className="text-red-400 text-sm mb-4 font-semibold p-2 bg-red-400/10 rounded-xl border border-red-400/20">{saveError}</p>}
            {saveSuccess && <p className="text-green-400 font-bold mb-4 text-center text-lg drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">✨ Successfully saved! ✨</p>}

            {!saveSuccess && (
                <div className="max-h-60 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
                    {boards.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/10">You have no boards. Create one in the Boards tab!</p>
                    ) : (
                        boards.map(board => (
                            <div 
                                key={board.board_id} 
                                className="flex justify-between items-center p-4 hover:bg-white/10 rounded-xl cursor-pointer border border-transparent hover:border-white/20 transition-all shadow-sm"
                                onClick={() => savePinToBoard(board.board_id)}
                            >
                                <span className="text-white font-semibold">{board.title}</span>
                                <span className="text-space-accent bg-space-accent/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Save</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <button 
                onClick={() => setSavingPin(null)} 
                className="w-full bg-transparent hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border-2 border-white/20 transition-all"
            >
                {saveSuccess ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
