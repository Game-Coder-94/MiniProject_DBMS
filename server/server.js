// server.js
const express = require('express');
const pinRoutes = require('./routes/pinRoutes');

const app = express();
app.use(express.json());

// Mount the routes
app.use('/api', pinRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));