# AstroPin Architecture & Component Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Port 5173)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   React Frontend                        ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │          App Component (App.jsx)                │  ││
│  │  │  - State: pins[], loading, error                │  ││
│  │  │  - useEffect: Fetch from /api/feed              │  ││
│  │  │  - Error handling & timeout (5s)                │  ││
│  │  └──────────────────────────────────────────────────┘  ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │     Masonry Grid (react-masonry-css)            │  ││
│  │  │  - 4 columns desktop → 1 mobile                 │  ││
│  │  │  - Pin cards with glassmorphism                 │  ││
│  │  │  - Hover animations & effects                   │  ││
│  │  └──────────────────────────────────────────────────┘  ││
│  │                                                         ││
│  │     Styling: Tailwind CSS + App.css Glassmorphism     ││
│  └─────────────────────────────────────────────────────────┘│
│           │                                                 │
│           │ Axios HTTP Requests (via Vite proxy)          │
│           │ GET /api/feed                                 │
│           ↓                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              NODE.JS Backend (Port 3000)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │          Express Server (server.js)                    ││
│  │  ┌────────────────────────────────────────────────┐   ││
│  │  │ CORS Middleware                               │   ││
│  │  │  - Origin: http://localhost:5173              │   ││
│  │  │  - Credentials: true                          │   ││
│  │  └────────────────────────────────────────────────┘   ││
│  │  ┌────────────────────────────────────────────────┐   ││
│  │  │ Routes (pinRoutes.js)                          │   ││
│  │  │  - GET /api/feed                              │   ││
│  │  │  - POST /api/nasa-ingest                       │   ││
│  │  │  - POST /api/seed                             │   ││
│  │  │  - GET /health                                │   ││
│  │  └────────────────────────────────────────────────┘   ││
│  │  ┌────────────────────────────────────────────────┐   ││
│  │  │ Controllers (pinController.js)                │   ││
│  │  │  - getFeed()      → Query v_main_feed         │   ││
│  │  │  - createPin()    → Call add_nasa_pin()       │   ││
│  │  │  - seedNasaData() → Fetch NASA API data       │   ││
│  │  └────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
│           │                                                 │
│           ↓                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │         PostgreSQL Database Connection                 ││
│  │  - Config: db.js (using connection pool)               ││
│  │  - Tables: pins, missions, space_objects, etc.         ││
│  │  - Views: v_main_feed (pre-joined data)                ││
│  │  - Stored Procedures: add_nasa_pin()                   ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

### Frontend Hierarchy
```
App.jsx (Main Component)
├── Header Section
│   ├── Title: "AstroPin"
│   └── Subtitle: "Discover and explore..."
├── Masonry Grid Container
│   └── Pin Card (repeated)
│       ├── Image Container
│       │   └── Responsive Image with error handling
│       └── Metadata Section
│           ├── Title (space_object)
│           ├── Mission Name
│           ├── Type Badge (with emoji)
│           └── Pinner Name

State Management:
├── pins: Array<Pin>
├── loading: Boolean
└── error: String | null
```

## Data Flow

### 1. Application Startup
```
Browser requests /
  ↓
Vite serves index.html
  ↓
React mounts App component
  ↓
useEffect hook triggers
  ↓
setLoading(true)
  ↓
Axios GET request → /api/feed
```

### 2. Successful Data Fetch
```
Backend: SELECT * FROM v_main_feed
  ↓
Returns: Array<Pin>
  ↓
Frontend receives response
  ↓
setPins(response.data)
  ↓
setLoading(false)
  ↓
Component re-renders with pins
  ↓
Masonry grid arranges cards
```

### 3. Error Scenarios
```
Network Error / Timeout
  ↓
catch(err) triggered
  ↓
setError(err.message)
  ↓
setLoading(false)
  ↓
Render error UI with message
```

## Pin Data Structure

```javascript
{
  pin_id: 1,                    // Unique identifier
  image_url: "https://...",     // High-res NASA image
  space_object: "Mars",         // Object name
  mission_name: "Perseverance", // Associated mission
  object_type: "P",             // P|G|N (Planet|Galaxy|Nebula)
  pinner: "nasa",               // Creator username
  created_at: "2026-04-23",     // Timestamp (optional)
  description: "..."            // (optional)
}
```

## CSS Architecture

```
index.css
├── @tailwind base
├── @tailwind components
├── @tailwind utilities
├── Dark space gradient background
└── Smooth scroll behavior

App.css (Glassmorphism Styles)
├── .my-masonry-grid
│   └── Flex container with gap offset
├── .my-masonry-grid_column
│   └── Column layout with gap
├── .pin-card
│   ├── Background: rgba(255,255,255,0.08)
│   ├── Backdrop blur: 10px
│   ├── Border: 1px rgba(255,255,255,0.1)
│   ├── Hover effects with glow
│   └── Box shadows for depth
├── .pin-image
│   ├── Responsive height (280→160px)
│   ├── object-fit: cover
│   └── Natural aspect ratio preservation
└── Responsive breakpoints (1100px, 700px, 500px)
```

## Responsive Breakpoints

```
┌─────────────────────────────────────────┐
│  Desktop (1100px+)                      │
│  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀   │
│  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄   │
│  Columns: 4                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Tablet (700-1099px)                    │
│  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀             │
│  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄             │
│  Columns: 3                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Small Tablet (500-699px)               │
│  ▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀                       │
│  ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄                       │
│  Columns: 2                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Mobile (<500px)                        │
│  ▀▀▀▀▀▀▀                                 │
│  ▄▄▄▄▄▄▄                                 │
│  Columns: 1                             │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
API Call Fails
  ├─ Timeout (5s) → "Failed to load the cosmos..."
  ├─ Network Error → Display error.message
  ├─ 500 Server Error → Show connection error UI
  ├─ Invalid JSON → "Invalid data format from server"
  └─ Empty array → "No celestial objects discovered yet"

Image Fails to Load
  └─ onError handler → Replace with SVG placeholder
```

## Performance Optimizations

1. **Code Splitting**: Vite auto-splits CSS and JS
2. **Image Loading**: `object-fit: cover` with responsive heights
3. **CSS Efficiency**: Tailwind purges unused classes
4. **Smooth Scrolling**: Hardware-accelerated transforms
5. **Lazy Rendering**: Masonry only renders visible pins
6. **Network Timeout**: 5s limit prevents hanging

## Environment Configuration

```
Development:
  - API URL: http://localhost:3000/api/feed (via Vite proxy)
  - HMR: Hot Module Replacement enabled
  - Debugging: Detailed error logs

Production:
  - API URL: http://localhost:3000/api/feed (direct)
  - Build: Optimized bundle with tree-shaking
  - CORS: Configured for production domain
```

---

**Last Updated**: April 23, 2026
**Version**: 1.0 - Production Ready
