const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class DownloadService {
  constructor() {
    this.ytdlpPath = process.env.YTDLP_PATH || 'yt-dlp';
    this.downloadsDir = process.env.DOWNLOADS_DIR || path.join(__dirname, '../../downloads');
    this.maxConcurrentDownloads = 3;
    this.activeDownloads = new Map();
    
    this.ensureDownloadsDir();
  }

  async ensureDownloadsDir() {
    try {
      await fs.mkdir(this.downloadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating downloads directory:', error);
    }
  }

  generateDownloadId() {
    return crypto.randomBytes(16).toString('hex');
  }

  async downloadTrack(videoId, options = {}) {
    const downloadId = this.generateDownloadId();
    const outputPath = path.join(this.downloadsDir, `${videoId}.%(ext)s`);
    
    const downloadInfo = {
      id: downloadId,
      videoId,
      status: 'downloading',
      progress: 0,
      startTime: Date.now(),
      outputPath: null,
    };
    
    this.activeDownloads.set(downloadId, downloadInfo);

    const ytdlpArgs = [
      `"https://youtube.com/watch?v=${videoId}"`,
      '-x',
      '--audio-format', options.format || 'mp3',
      '--audio-quality', options.quality || '0',
      '--output', `"${outputPath}"`,
      '--no-playlist',
      '--embed-thumbnail',
      '--embed-metadata',
      '--add-metadata',
    ];

    if (options.extractAudio !== false) {
      ytdlpArgs.push('--extract-audio');
    }

    const command = `${this.ytdlpPath} ${ytdlpArgs.join(' ')}`;

    return new Promise((resolve, reject) => {
      const process = exec(command, { maxBuffer: 1024 * 1024 * 10 });

      let errorOutput = '';

      process.stdout.on('data', (data) => {
        const output = data.toString();
        
        // Parse progress
        const progressMatch = output.match(/(\d+\.?\d*)%/);
        if (progressMatch) {
          downloadInfo.progress = parseFloat(progressMatch[1]);
        }

        // Parse destination file
        const destMatch = output.match(/Destination: (.+)/);
        if (destMatch) {
          downloadInfo.outputPath = destMatch[1].trim();
        }
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          downloadInfo.status = 'completed';
          downloadInfo.progress = 100;
          downloadInfo.endTime = Date.now();
          resolve(downloadInfo);
        } else {
          downloadInfo.status = 'failed';
          downloadInfo.error = errorOutput;
          this.activeDownloads.delete(downloadId);
          reject(new Error(`Download failed: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        downloadInfo.status = 'failed';
        downloadInfo.error = error.message;
        this.activeDownloads.delete(downloadId);
        reject(error);
      });
    });
  }

  async downloadPlaylist(playlistId, options = {}) {
    const downloadId = this.generateDownloadId();
    const playlistDir = path.join(this.downloadsDir, `playlist_${playlistId}`);
    
    await fs.mkdir(playlistDir, { recursive: true });

    const downloadInfo = {
      id: downloadId,
      playlistId,
      status: 'downloading',
      progress: 0,
      totalTracks: 0,
      completedTracks: 0,
      failedTracks: 0,
      tracks: [],
      startTime: Date.now(),
    };
    
    this.activeDownloads.set(downloadId, downloadInfo);

    // First, get playlist info
    const infoCommand = `${this.ytdlpPath} --flat-playlist --dump-json "https://youtube.com/playlist?list=${playlistId}"`;
    
    try {
      const trackIds = await this.getPlaylistTracks(infoCommand);
      downloadInfo.totalTracks = trackIds.length;
      downloadInfo.tracks = trackIds.map(id => ({ id, status: 'pending' }));

      // Download tracks with concurrency limit
      const chunks = [];
      for (let i = 0; i < trackIds.length; i += this.maxConcurrentDownloads) {
        chunks.push(trackIds.slice(i, i + this.maxConcurrentDownloads));
      }

      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map(async (videoId) => {
            try {
              const trackInfo = downloadInfo.tracks.find(t => t.id === videoId);
              trackInfo.status = 'downloading';
              
              await this.downloadTrack(videoId, {
                ...options,
                outputPath: path.join(playlistDir, `${videoId}.%(ext)s`),
              });
              
              trackInfo.status = 'completed';
              downloadInfo.completedTracks++;
            } catch (error) {
              const trackInfo = downloadInfo.tracks.find(t => t.id === videoId);
              trackInfo.status = 'failed';
              trackInfo.error = error.message;
              downloadInfo.failedTracks++;
            }
            
            downloadInfo.progress = (downloadInfo.completedTracks + downloadInfo.failedTracks) / downloadInfo.totalTracks * 100;
          })
        );
      }

      downloadInfo.status = 'completed';
      downloadInfo.endTime = Date.now();
      
      return downloadInfo;
    } catch (error) {
      downloadInfo.status = 'failed';
      downloadInfo.error = error.message;
      throw error;
    }
  }

  getPlaylistTracks(command) {
    return new Promise((resolve, reject) => {
      exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          const tracks = stdout
            .trim()
            .split('\n')
            .filter(line => line.trim())
            .map(line => {
              try {
                const data = JSON.parse(line);
                return data.id || data.url?.split('v=')[1]?.split('&')[0];
              } catch {
                return null;
              }
            })
            .filter(id => id);
          
          resolve(tracks);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getDownloadStatus(downloadId) {
    return this.activeDownloads.get(downloadId);
  }

  getAllDownloads() {
    return Array.from(this.activeDownloads.values());
  }

  async cancelDownload(downloadId) {
    const downloadInfo = this.activeDownloads.get(downloadId);
    if (downloadInfo) {
      downloadInfo.status = 'cancelled';
      this.activeDownloads.delete(downloadId);
      return true;
    }
    return false;
  }

  async getDownloadedFiles() {
    try {
      const files = await fs.readdir(this.downloadsDir);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.downloadsDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
      );
      return fileStats;
    } catch (error) {
      console.error('Error getting downloaded files:', error);
      return [];
    }
  }

  async deleteDownload(filename) {
    try {
      const filePath = path.join(this.downloadsDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async cleanupOldDownloads(maxAgeDays = 7) {
    try {
      const files = await this.getDownloadedFiles();
      const now = Date.now();
      const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const age = now - file.created.getTime();
        if (age > maxAgeMs) {
          await this.deleteDownload(file.name);
          console.log(`Cleaned up old download: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old downloads:', error);
    }
  }
}

module.exports = new DownloadService();
