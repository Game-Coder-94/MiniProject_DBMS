import React, { useEffect } from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, pin, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !pin) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal-backdrop" onClick={handleBackdropClick}>
      <div className="image-modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="modal-content">
          <div className="modal-image-wrapper">
            <img
              src={pin.image_url}
              alt={pin.title || pin.space_object}
              className="modal-image"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect fill="%23223344" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23aabbcc" font-size="24"%3EImage unavailable%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          <div className="modal-info">
            <h2 className="modal-title">
              {pin.title || pin.space_object || 'Untitled'}
            </h2>

            <div className="modal-metadata">
              {pin.description && (
                <div className="metadata-item">
                  <h3 className="metadata-label">Description</h3>
                  <p className="metadata-value">{pin.description}</p>
                </div>
              )}

              {(pin.mission_name || pin.photographer) && (
                <div className="metadata-item">
                  <h3 className="metadata-label">Details</h3>
                  <p className="metadata-value">
                    {pin.mission_name || pin.photographer || 'NASA'}
                  </p>
                </div>
              )}

              {pin.date_created && (
                <div className="metadata-item">
                  <h3 className="metadata-label">Date</h3>
                  <p className="metadata-value">
                    {new Date(pin.date_created).toLocaleDateString()}
                  </p>
                </div>
              )}

              {pin.object_type && (
                <div className="metadata-item">
                  <h3 className="metadata-label">Type</h3>
                  <p className="metadata-value">
                    {pin.object_type === 'P' && '🪐 Planet'}
                    {pin.object_type === 'G' && '🌌 Galaxy'}
                    {pin.object_type === 'N' && '🌫️ Nebula'}
                    {!['P', 'G', 'N'].includes(pin.object_type) && pin.object_type}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              {pin.source_url && (
                <a
                  href={pin.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn modal-btn-primary"
                >
                  🔗 View on NASA
                </a>
              )}
              <button className="modal-btn modal-btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
