const ytdlpService = require('../services/ytdlpService');
const lyricsService = require('../services/lyricsService');

// Regex to validate YouTube video and playlist IDs
const YOUTUBE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_PLAYLIST_ID_REGEX = /^[a-zA-Z0-9_-]{24,34}$/;

class MusicController {
  async search(req, res) {
    try {
      const { query, limit } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const results = await ytdlpService.search(query, parseInt(limit) || 20);
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Search controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getVideoInfo(req, res) {
    try {
      const { videoId } = req.params;
      
      if (!videoId || !YOUTUBE_VIDEO_ID_REGEX.test(videoId)) {
        return res.status(400).json({ error: 'Invalid or missing Video ID' });
      }

      const info = await ytdlpService.getVideoInfo(videoId);
      res.json(info);
    } catch (error) {
      console.error('Get video info controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAudioUrl(req, res) {
    try {
      const { videoId } = req.params;
      
      if (!videoId || !YOUTUBE_VIDEO_ID_REGEX.test(videoId)) {
        return res.status(400).json({ error: 'Invalid or missing Video ID' });
      }

      const url = await ytdlpService.getAudioUrl(videoId);
      res.json({ url, videoId });
    } catch (error) {
      console.error('Get audio URL controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAudioFormats(req, res) {
    try {
      const { videoId } = req.params;
      
      if (!videoId || !YOUTUBE_VIDEO_ID_REGEX.test(videoId)) {
        return res.status(400).json({ error: 'Invalid or missing Video ID' });
      }

      const formats = await ytdlpService.getAudioFormats(videoId);
      res.json({ formats, count: formats.length });
    } catch (error) {
      console.error('Get audio formats controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getTrending(req, res) {
    try {
      const { region } = req.query;
      const results = await ytdlpService.getTrending(region || 'US');
      res.json({ results, count: results.length });
    } catch (error) {
      console.error('Get trending controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async streamAudio(req, res) {
    try {
      const { videoId } = req.params;
      
      if (!videoId || !YOUTUBE_VIDEO_ID_REGEX.test(videoId)) {
        return res.status(400).json({ error: 'Invalid or missing Video ID' });
      }

      const url = await ytdlpService.getAudioUrl(videoId);
      
      // Redirect to the audio stream URL
      res.redirect(url);
    } catch (error) {
      console.error('Stream audio controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getPlaylist(req, res) {
    try {
      const { playlistId } = req.params;

      if (!playlistId || !YOUTUBE_PLAYLIST_ID_REGEX.test(playlistId)) {
        return res.status(400).json({ error: 'Invalid or missing Playlist ID' });
      }

      const playlist = await ytdlpService.getPlaylist(playlistId);
      res.json(playlist);
    } catch (error) {
      console.error('Get playlist controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getLyrics(req, res) {
    try {
      const { artist, title } = req.query;

      if (!artist || !title) {
        return res.status(400).json({ error: 'artist and title query parameters are required' });
      }

      const lyrics = await lyricsService.getLyrics(artist, title);

      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }

      res.json(lyrics);
    } catch (error) {
      console.error('Get lyrics controller error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async healthCheck(req, res) {
    try {
      const ytdlpStatus = await ytdlpService.checkYtDlp();
      res.json({
        status: 'ok',
        ytdlp: ytdlpStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  }
}

module.exports = new MusicController();
