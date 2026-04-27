import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import ImageModal from '../components/ImageModal';
import './Boards.css';
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
      <div className="boards-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <p style={{color: 'var(--color-secondary)', fontSize: '1.25rem', fontWeight: '600'}}>Loading the cosmos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="boards-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="board-card" style={{textAlign: 'center', maxWidth: '400px'}}>
          <p style={{color: '#f87171', fontSize: '1.25rem', marginBottom: '0.5rem'}}>Connection Error</p>
          <p style={{color: '#cbd5e1', marginBottom: '1rem'}}>{error}</p>
          <button onClick={() => navigate('/boards')} className="details-empty-btn">Return to Boards</button>
        </div>
      </div>
    );
  }

  return (
    <div className="boards-container">
      <div style={{position: 'relative', maxWidth: '1200px', margin: '0 auto'}}>
        <div className="board-details-nav">
          <button 
              onClick={() => navigate('/boards')} 
              className="back-btn"
          >
              <span>←</span> Back to Boards
          </button>
        </div>
        
        <div className="boards-header" style={{paddingTop: '4rem'}}>
          <h1 className="boards-title">
            {boardDetails ? boardDetails.title : 'Board Details'}
          </h1>
          <p className="boards-subtitle">
            {boardDetails?.description || 'Your curated celestial artifacts.'}
          </p>
        </div>

        <div className="boards-content">
            {pins.length === 0 ? (
              <div className="boards-empty">
                <span className="boards-empty-icon">🔭</span>
                <h3 className="boards-empty-title">No Pins Found</h3>
                <p className="boards-empty-text" style={{marginBottom: '1.5rem'}}>This board is currently empty. Head over to the feed or explore to start saving pins!</p>
                <button 
                    onClick={() => navigate('/')}
                    className="details-empty-btn"
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
