const ytdlpService = require('../services/ytdlpService');

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
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
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
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
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
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
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
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const url = await ytdlpService.getAudioUrl(videoId);
      
      // Redirect to the audio stream URL
      res.redirect(url);
    } catch (error) {
      console.error('Stream audio controller error:', error);
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
