const axios = require('axios');

const NASA_API_BASE = 'https://images-api.nasa.gov';

async function getNasaImages(req, res) {
  try {
    const { q = 'space' } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: {
          message: 'Search query is required',
          status: 400
        }
      });
    }

    // Fetch from NASA Images API
    const response = await axios.get(`${NASA_API_BASE}/search`, {
      params: {
        q: q.trim(),
        media_type: 'image',
        page: 1
      },
      timeout: 10000
    });

    if (!response.data || !response.data.collection || !response.data.collection.items) {
      return res.status(200).json([]);
    }

    // Transform NASA API response to our format
    const images = response.data.collection.items
      .slice(0, 20) // Limit to 20 results
      .map(item => {
        const data = item.data[0] || {};
        const links = item.links || [];
        const imageLink = links.find(link => link.rel === 'preview' || link.href.includes('~thumb'));
        
        return {
          title: data.title || 'Untitled',
          description: data.description || 'No description available',
          image_url: imageLink?.href || (links[0]?.href || ''),
          source_url: `https://images.nasa.gov/details/${data.nasa_id || ''}`,
          nasa_id: data.nasa_id || null,
          date_created: data.date_created || null,
          photographer: data.photographer ? data.photographer[0] : null,
        };
      })
      .filter(img => img.image_url); // Filter out items without images

    res.json(images);
  } catch (error) {
    console.error('Error fetching NASA images:', error.message);
    
    // Handle specific error types
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: {
          message: 'NASA API request timeout',
          status: 504
        }
      });
    }

    res.status(500).json({
      error: {
        message: 'Failed to fetch NASA images: ' + error.message,
        status: 500
      }
    });
  }
}

module.exports = {
  getNasaImages
};
