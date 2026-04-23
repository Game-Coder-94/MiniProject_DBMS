import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import './App.css'; // Make sure to add the specific react-masonry-css styles here

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching from your Route 1: /api/feed
    axios.get('/api/feed')
      .then(response => {
        console.log("Backend Response:", response.data);

        if (Array.isArray(response.data)) {
          setPins(response.data);
        } else {
          console.error("Expected array, but recieved:", typeof response.data);
          setPins([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching pins:", error);
        setLoading(false);
      });
  }, []);

  // Breakpoints for responsive design
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) return <div className="text-white text-center mt-10">Loading the cosmos...</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pins.map(pin => (
          <div key={pin.pin_id} className="pin-card">
            <img src={pin.image_url} alt={pin.space_object} className="pin-image" />
            <div className="p-4">
              <h3 className="font-bold text-lg">{pin.space_object}</h3>
              <p className="text-sm text-gray-400 mt-1">Mission: {pin.mission_name}</p>
              <div className="mt-3 flex items-center justify-between">
                 <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Type: {pin.object_type}
                 </span>
                 <span className="text-xs text-gray-400">@{pin.pinner}</span>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Feed;