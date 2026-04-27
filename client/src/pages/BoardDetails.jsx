import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import ImageModal from '../components/ImageModal';
import '../App.css';

const BoardDetails = () => {
  const { boardId } = useParams();
  const [pins, setPins] = useState([]);
  const [boardDetails, setBoardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      const token = localStorage.getItem('astro_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const apiUrl = import.meta.env.DEV ? `/api/boards/${boardId}/pins` : `http://localhost:3000/api/boards/${boardId}/pins`;
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPins(response.data);

        // Fetch board details to display title
        const boardsUrl = import.meta.env.DEV ? '/api/boards' : 'http://localhost:3000/api/boards';
        const boardsResponse = await axios.get(boardsUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentBoard = boardsResponse.data.find(b => b.board_id === parseInt(boardId));
        if (currentBoard) {
            setBoardDetails(currentBoard);
        }

      } catch (err) {
        console.error("Error fetching board pins:", err);
        setError('Failed to load board details');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, navigate]);

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
          <button onClick={() => navigate('/boards')} className="px-4 py-2 bg-nebula-purple text-white rounded-xl font-bold">Return to Boards</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-deeper p-4 md:p-8 pb-[200px]">
      <div className="max-w-6xl mx-auto pt-10 pb-8 relative">
        <button 
            onClick={() => navigate('/boards')} 
            className="absolute top-10 left-0 text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-medium"
        >
            <span>←</span> Back to Boards
        </button>
        <div className="text-center mt-12 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-nebula-purple via-blue-400 to-cyan-300 tracking-tight leading-tight mb-4 drop-shadow-lg drop-shadow-purple-500/20">
            {boardDetails ? boardDetails.title : 'Board Details'}
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
            {boardDetails?.description || 'Your curated celestial artifacts.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
          {pins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 text-center max-w-2xl mx-auto">
              <span className="text-6xl mb-4 opacity-50">🔭</span>
              <h3 className="text-2xl font-bold text-white mb-2">No Pins Found</h3>
              <p className="text-slate-400 mb-6">This board is currently empty. Head over to the feed or explore to start saving pins!</p>
              <button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-nebula-purple to-cyan-500 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                  Explore Feed
              </button>
            </div>
          ) : (
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
                    </div>
                  </div>

                  <div className="pin-meta p-4">
                    <div>
                      <h3 className="pin-title">{pin.space_object}</h3>
                      <p className="pin-description">{pin.mission_name || 'Unknown mission'}</p>
                    </div>
                    <div className="pin-footer mt-2 flex justify-between items-center">
                      <span className="pin-author text-xs text-slate-400">
                          Added {pin.added_at ? new Date(pin.added_at).toLocaleDateString() : new Date(pin.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        pin={selectedPin}
        onClose={closeModal}
      />
    </div>
  );
};

export default BoardDetails;
