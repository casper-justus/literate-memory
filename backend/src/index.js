require('dotenv').config();
const express = require('express');
const cors = require('cors');
const musicRoutes = require('./routes/musicRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/music', musicRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Music Player API with yt-dlp',
    version: '1.0.0',
    endpoints: {
      search: '/api/music/search?query=<query>&limit=<limit>',
      trending: '/api/music/trending?region=<region>',
      videoInfo: '/api/music/video/:videoId',
      audioUrl: '/api/music/audio/:videoId',
      formats: '/api/music/formats/:videoId',
      stream: '/api/music/stream/:videoId',
      playlist: '/api/music/playlist/:playlistId',
      lyrics: '/api/music/lyrics?artist=<artist>&title=<title>',
      health: '/api/music/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎵 Music Player API Server`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📡 API endpoints available at http://localhost:${PORT}/api/music`
  );
  console.log(`\nPress Ctrl+C to stop\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully');
  process.exit(0);
});
