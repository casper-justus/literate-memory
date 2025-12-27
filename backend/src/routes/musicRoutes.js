const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const downloadController = require('../controllers/downloadController');

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

// Get playlist information
router.get('/playlist/:playlistId', musicController.getPlaylist);

// Lyrics
router.get('/lyrics', musicController.getLyrics);

// Download endpoints
router.post('/download/track/:videoId', downloadController.downloadTrack);
router.post('/download/playlist/:playlistId', downloadController.downloadPlaylist);
router.get('/download/status/:downloadId', downloadController.getDownloadStatus);
router.get('/downloads', downloadController.getAllDownloads);
router.delete('/download/:downloadId', downloadController.cancelDownload);

// Downloaded files management
router.get('/downloads/files', downloadController.getDownloadedFiles);
router.get('/downloads/files/:filename', downloadController.downloadFile);
router.delete('/downloads/files/:filename', downloadController.deleteFile);

// Health check
router.get('/health', musicController.healthCheck);

module.exports = router;
