import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import ImageModal from '../components/ImageModal';
import '../App.css';

const Explore = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('space');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingImage, setSavingImage] = useState(null);
  const [boards, setBoards] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchNasaImages = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.DEV 
        ? `/api/explore?q=${query}` 
        : `http://localhost:3000/api/explore?q=${query}`;
      
      const response = await axios.get(apiUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        console.warn("Expected array, but received:", typeof response.data);
        setImages([]);
        setError('Invalid data format from NASA');
      }
    } catch (err) {
      console.error("Error fetching NASA images:", err);
      setError(err.message || 'Failed to fetch NASA images...');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNasaImages(searchQuery);
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleSaveClick = async (image) => {
    const token = localStorage.getItem('astro_token');
    if (!token) {
        alert('Please log in to save pins.');
        return;
    }
    setSavingImage(image);
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

  const saveExploreToBoardModal = async (boardId) => {
    try {
        const token = localStorage.getItem('astro_token');
        const apiUrl = import.meta.env.DEV ? '/api/boards/save-explore' : 'http://localhost:3000/api/boards/save-explore';
        await axios.post(apiUrl, { 
            board_id: boardId, 
            image_url: savingImage.image_url,
            title: savingImage.title,
            description: savingImage.description
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSaveSuccess(true);
        setTimeout(() => setSavingImage(null), 1500);
    } catch (err) {
        setSaveError('Failed to save to board. Could not import the NASA object.');
    }
  };

  const handlePinClick = async (image) => {
    const token = localStorage.getItem('astro_token');
    const userStr = localStorage.getItem('astro_user');
    
    if (!token || !userStr) {
        alert('Please log in to pin images directly.');
        return;
    }
    
    const user = JSON.parse(userStr);

    try {
        const apiUrl = import.meta.env.DEV ? '/api/nasa-ingest' : 'http://localhost:3000/api/nasa-ingest';
        await axios.post(apiUrl, {
            user_id: user.user_id || user.id,
            mission_id: null,
            img_url: image.image_url,
            desc: image.description || '',
            obj_name: image.title || 'NASA Image',
            obj_type: 'NASA',
            mass: null,
            dist: null
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('Successfully pinned to the feed! 📌');
    } catch (err) {
        alert('Failed to pin the image. ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchNasaImages(searchQuery);
    }
  };

  const handleRandomExplore = () => {
    const randomQueries = ['nebula', 'galaxy', 'planet', 'star', 'cosmic', 'moon', 'solar', 'hubble', 'mars', 'aurora'];
    const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
    setSearchQuery(randomQuery);
    fetchNasaImages(randomQuery);
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
          <p className="text-nebula-purple text-lg font-semibold">Exploring the cosmos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-deeper p-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-400 text-lg mb-2">Oops! Something went wrong</p>
          <p className="text-slate-300 mb-4">{error}</p>
          <p className="text-slate-400 text-sm">Try searching for something else or refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-deeper p-4 md:p-8 pb-[400px]">
      {images.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="empty-state">
            <div className="empty-state-icon">🌌</div>
            <p className="empty-state-title">No images found</p>
            <p className="empty-state-subtitle">Try searching for "{searchQuery}" or explore something different</p>
          </div>
        </div>
      ) : (
        <>
          <div className="results-header">
            <p className="results-count">✨ Found {images.length} cosmic discoveries for <span>"{searchQuery}"</span></p>
          </div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="pin-card cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => openModal(image)}
              >
                <div className="pin-image-wrap">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="pin-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="280"%3E%3Crect fill="%23223344" width="400" height="280"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23aabbcc" font-size="18"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="pin-badges">
                    <span className="pin-badge pin-badge-type">🌌 NASA</span>
                    <a
                      href={image.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pin-badge pin-badge-save hover:bg-nebula-purple"
                    >
                      View
                    </a>
                  </div>
                </div>

                <div className="pin-meta p-4">
                  <div>
                    <h3 className="pin-title line-clamp-2">{image.title}</h3>
                    <p className="pin-description line-clamp-3">{image.description}</p>
                  </div>
                  <div className="pin-footer">
                    <span className="pin-author">@nasa</span>
                    <div className="flex gap-2">
                        <button className="pin-action text-white hover:bg-space-accent/20 border border-transparent hover:border-space-accent/30 transition-all flex items-center justify-center bg-black/40 px-3 py-1 rounded-full text-xs font-bold shadow-sm" onClick={(e) => { e.stopPropagation(); handlePinClick(image); }}>📌 Pin</button>
                        <button className="pin-action" onClick={(e) => { e.stopPropagation(); handleSaveClick(image); }}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </>
      )}

      <div className="floating-header explore-floating-header">
        <div className="floating-header-content">
          <div className="floating-header-title-section">
            <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text bg-gradient-to-r from-nebula-purple via-blue-400 to-cyan-300 leading-tight">
              🔭 Explore NASA
            </h1>
            <p className="text-slate-300 max-w-xl leading-relaxed hidden md:block">Discover random images from NASA's vast collection. Search for anything from space!</p>
          </div>

          <form onSubmit={handleSearch} className="explore-search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for nebulas, planets, galaxies..."
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            <button
              type="submit"
              className="search-btn search-btn-primary"
            >
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={handleRandomExplore}
              className="search-btn search-btn-secondary"
            >
              <span>🎲 Surprise Me</span>
            </button>
          </form>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        pin={selectedImage}
        onClose={closeModal}
      />

      {/* Save to Board Modal */}
      {savingImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-space-dark border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-nebula-purple to-cyan-300 font-bold mb-6">Save to Board</h2>
            <div className="flex gap-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <img src={savingImage.image_url} alt="Pin preview" className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-white font-bold truncate">{savingImage.title}</h3>
                    <p className="text-slate-400 text-sm truncate">NASA Explore Collection</p>
                </div>
            </div>
            
            {saveError && <p className="text-red-400 text-sm mb-4 font-semibold p-2 bg-red-400/10 rounded-xl border border-red-400/20">{saveError}</p>}
            {saveSuccess && <p className="text-green-400 font-bold mb-4 text-center text-lg drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">✨ Seamlessly added! ✨</p>}

            {!saveSuccess && (
                <div className="max-h-60 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-2">
                    {boards.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/10">You have no operational boards left!</p>
                    ) : (
                        boards.map(board => (
                            <div 
                                key={board.board_id} 
                                className="flex justify-between items-center p-4 hover:bg-white/10 rounded-xl cursor-pointer border border-transparent hover:border-white/20 transition-all shadow-sm"
                                onClick={() => saveExploreToBoardModal(board.board_id)}
                            >
                                <span className="text-white font-semibold">{board.title}</span>
                                <span className="text-space-accent bg-space-accent/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Save</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <button 
                onClick={() => setSavingImage(null)} 
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

export default Explore;
