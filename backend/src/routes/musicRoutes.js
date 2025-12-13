const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// Search for videos
router.get('/search', musicController.search);

// Get trending videos
router.get('/trending', musicController.getTrending);

// Get video information
router.get('/video/:videoId', musicController.getVideoInfo);

// Get audio URL
router.get('/audio/:videoId', musicController.getAudioUrl);

// Get available audio formats
router.get('/formats/:videoId', musicController.getAudioFormats);

// Stream audio (redirect to stream URL)
router.get('/stream/:videoId', musicController.streamAudio);

// Health check
router.get('/health', musicController.healthCheck);

module.exports = router;
