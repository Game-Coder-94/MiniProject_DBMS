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
    </div>
  );
};

export default Explore;
