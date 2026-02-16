const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static HLS files
app.use('/streams', express.static(path.join(__dirname, '../streams')));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Multi-Video Streaming API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
