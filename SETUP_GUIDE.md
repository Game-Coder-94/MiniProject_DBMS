# AstroPin - Mini Project Setup Guide

## Overview

**AstroPin** is a high-performance React application that delivers an immersive space-science discovery experience. It features:

- **Dynamic Masonry Grid**: Variable-height NASA imagery cascading naturally using `react-masonry-css`
- **Dark Space Theme**: Deep-space aesthetic with modern glassmorphism effects
- **Frosted UI Components**: Translucent backdrops elegantly displaying scientific metadata
- **Lightweight Data Layer**: Axios-powered async data fetching from Node.js backend
- **High Responsiveness**: Optimized rendering with pre-joined JSON payloads

## Project Structure

```
client/                 # React + Vite frontend
├── src/
│   ├── App.jsx        # Main feed component with masonry grid
│   ├── App.css        # Glassmorphism styling
│   ├── index.css      # Tailwind CSS setup
│   └── main.jsx       # React entry point
├── tailwind.config.js # Tailwind configuration
└── postcss.config.js  # PostCSS configuration

server/                 # Express.js backend
├── server.js          # Main server with CORS support
├── config/
│   └── db.js          # PostgreSQL connection pool
├── routes/
│   └── pinRoutes.js   # API routes
├── controllers/
│   └── pinController.js    # Business logic for pin operations
└── services/
    └── nasaService.js      # NASA API integration
```

## Setup Instructions

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   # Database Configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=astropin
   DB_PASSWORD=your_password_here
   DB_PORT=5432

   # Server Configuration
   PORT=3000
   CLIENT_URL=http://localhost:5173
   ```

3. **Ensure PostgreSQL is running** with the `astropin` database set up

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the server**:
   ```bash
   npm start
   # or
   node server.js
   ```

   Expected output:
   ```
   🚀 Server running on http://localhost:3000
   📡 CORS enabled for http://localhost:5173
   ```

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies** (already done if Tailwind was added):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` with automatic proxy to backend API

## Key Features

### Glassmorphism Design
- **Backdrop Blur**: 10px blur effect on pin cards
- **Semi-transparent Backgrounds**: `rgba(255, 255, 255, 0.08)` for elegant layering
- **Soft Borders**: Subtle 1px borders with transparency
- **Hover Effects**: Smooth transitions with color accent glow

### Responsive Grid
```javascript
const breakpointColumnsObj = {
  default: 4,    // Desktop
  1100: 3,       // Tablet
  700: 2,        // Small tablet
  500: 1         // Mobile
};
```

### Error Handling
- Connection error detection with user-friendly messaging
- Missing data fallback with placeholder images
- Loading state with animated spinner
- Graceful handling of API timeout (5 seconds)

### Data Structure
Each pin contains:
```json
{
  "pin_id": 1,
  "image_url": "https://...",
  "space_object": "Mars",
  "mission_name": "Perseverance Rover",
  "object_type": "P",  // P=Planet, G=Galaxy, N=Nebula
  "pinner": "nasa"
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feed` | Fetch all pins from the feed |
| POST | `/api/nasa-ingest` | Manually ingest a NASA pin |
| POST | `/api/seed` | Seed database with NASA API data |
| GET | `/health` | Check server status |

## Styling System

### Colors
- **Background**: Deep space gradient (`#0f0f1e` to `#16213e`)
- **Accent**: Vibrant purple (`#8b5cf6`)
- **Text**: Slate colors for contrast

### Components
- **Pin Cards**: Glassmorphic containers with image + metadata
- **Tags**: Type indicators with emoji and styled badges
- **Loading**: Pulsing animation with cosmos message

## Troubleshooting

### "Cannot GET /api/feed"
- Ensure backend server is running on port 3000
- Check `.env` file exists with database credentials

### Images not loading
- Verify image URLs are accessible
- App has fallback placeholder SVG for broken images

### Tailwind styles not applying
- Rebuild: `npm run build`
- Clear cache: Delete `node_modules/.vite` and `.next`
- Check `tailwind.config.js` content paths

### CORS errors
- Backend `.env` CLIENT_URL must match frontend URL
- Default: `http://localhost:5173`

## Development Tips

### Hot Reload
- Changes to React components auto-refresh via Vite HMR
- CSS changes apply instantly without full reload

### Debugging
- Open DevTools to see API responses in Network tab
- Console logs show component state and errors

### Performance
- Masonry grid lazy-loads as user scrolls
- Image optimization via native `object-fit: cover`
- Minimal bundle size with Vite's tree-shaking

## Next Steps

1. **Seed database**: Call `POST /api/seed` with search query
2. **Explore imagery**: Browse pins in the masonry grid
3. **Add custom pins**: Use `POST /api/nasa-ingest` endpoint
4. **Deploy**: Configure for production (adjust CORS origins, database)

---

**Created for DBMS Mini Project** | AstroPin - Cosmic Discovery Platform
