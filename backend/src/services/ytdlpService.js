const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class YtDlpService {
  constructor() {
    this.ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';
    this.cacheDir = process.env.CACHE_DIR || path.join(__dirname, '../../cache');
    this.ensureCacheDir();
  }

  async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create cache directory:', error);
    }
  }

  async execFile(args) {
    return new Promise((resolve, reject) => {
      const process = spawn(this.ytdlpPath, args);
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  async search(query, limit = 20) {
    try {
      const args = [`ytsearch${limit}:${query}`, '--dump-json', '--skip-download'];
      const { stdout } = await this.execFile(args);
      
      const results = stdout.trim().split('\n').filter(line => line).map(line => {
        try {
          const data = JSON.parse(line);
          return {
            videoId: data.id,
            title: data.title,
            channelTitle: data.uploader || data.channel,
            thumbnail: data.thumbnail || data.thumbnails?.[0]?.url,
            duration: this.formatDuration(data.duration),
            durationSeconds: data.duration,
            viewCount: data.view_count?.toString(),
            uploadDate: data.upload_date,
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return results;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search videos');
    }
  }

  async getVideoInfo(videoId) {
    try {
      const args = [`https://www.youtube.com/watch?v=${videoId}`, '--dump-json', '--skip-download'];
      const { stdout } = await this.execFile(args);
      
      const data = JSON.parse(stdout);
      return {
        videoId: data.id,
        title: data.title,
        channelTitle: data.uploader || data.channel,
        thumbnail: data.thumbnail || data.thumbnails?.[0]?.url,
        duration: this.formatDuration(data.duration),
        durationSeconds: data.duration,
        viewCount: data.view_count?.toString(),
        uploadDate: data.upload_date,
        description: data.description,
      };
    } catch (error) {
      console.error('Get video info error:', error);
      throw new Error('Failed to get video info');
    }
  }

  async getAudioUrl(videoId) {
    try {
      const args = [`https://www.youtube.com/watch?v=${videoId}`, '-f', 'bestaudio', '--get-url'];
      const { stdout } = await this.execFile(args);
      
      const url = stdout.trim();
      return url;
    } catch (error) {
      console.error('Get audio URL error:', error);
      throw new Error('Failed to get audio URL');
    }
  }

  async getAudioFormats(videoId) {
    try {
      const args = [`https://www.youtube.com/watch?v=${videoId}`, '-F', '--dump-json', '--skip-download'];
      const { stdout } = await this.execFile(args);
      
      const data = JSON.parse(stdout);
      const audioFormats = data.formats.filter(f => 
        f.acodec && f.acodec !== 'none' && !f.vcodec || f.vcodec === 'none'
      );

      return audioFormats.map(f => ({
        formatId: f.format_id,
        ext: f.ext,
        acodec: f.acodec,
        abr: f.abr,
        asr: f.asr,
        filesize: f.filesize,
        url: f.url,
      }));
    } catch (error) {
      console.error('Get audio formats error:', error);
      throw new Error('Failed to get audio formats');
    }
  }

  async downloadAudio(videoId, outputPath) {
    try {
      const args = [`https://www.youtube.com/watch?v=${videoId}`, '-f', 'bestaudio', '-o', outputPath, '--extract-audio', '--audio-format', 'mp3'];
      await this.execFile(args);
      
      return outputPath;
    } catch (error) {
      console.error('Download audio error:', error);
      throw new Error('Failed to download audio');
    }
  }

  async getTrending(region = 'US') {
    try {
      const args = ['https://www.youtube.com/feed/trending', '--dump-json', '--skip-download', '--playlist-items', '1-20'];
      const { stdout } = await this.execFile(args);

      const results = stdout
        .trim()
        .split('\n')
        .filter((line) => line)
        .map((line) => {
          try {
            const data = JSON.parse(line);
            return {
              videoId: data.id,
              title: data.title,
              channelTitle: data.uploader || data.channel,
              thumbnail: data.thumbnail || data.thumbnails?.[0]?.url,
              duration: this.formatDuration(data.duration),
              durationSeconds: data.duration,
              viewCount: data.view_count?.toString(),
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return results;
    } catch (error) {
      console.error('Get trending error:', error);
      // Fallback to search for popular music
      return this.search('top music 2024', 20);
    }
  }

  async getPlaylist(playlistId) {
    try {
      const args = [`https://www.youtube.com/playlist?list=${playlistId}`, '--dump-single-json', '--flat-playlist', '--skip-download'];
      const { stdout } = await this.execFile(args);

      const data = JSON.parse(stdout);

      const entries = Array.isArray(data.entries) ? data.entries : [];

      const tracks = entries
        .filter((e) => e && e.id)
        .map((e) => ({
          videoId: e.id,
          title: e.title,
          channelTitle: e.uploader || e.channel || e.uploader_id || data.uploader,
          thumbnail: e.thumbnail || e.thumbnails?.[0]?.url,
          durationSeconds: e.duration || 0,
        }));

      return {
        playlistId,
        title: data.title,
        author: data.uploader || data.channel || 'YouTube',
        description: data.description,
        thumbnail: data.thumbnail,
        videoCount: typeof data.playlist_count === 'number' ? data.playlist_count : tracks.length,
        tracks,
      };
    } catch (error) {
      console.error('Get playlist error:', error);
      throw new Error('Failed to get playlist');
    }
  }

  formatDuration(seconds) {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async checkYtDlp() {
    try {
      const { stdout } = await this.execFile(['--version']);
      return { installed: true, version: stdout.trim() };
    } catch (error) {
      return { installed: false, version: null };
    }
  }
}

module.exports = new YtDlpService();
