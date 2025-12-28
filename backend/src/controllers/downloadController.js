const downloadService = require('../services/downloadService');
const path = require('path');

class DownloadController {
  async downloadTrack(req, res) {
    try {
      const { videoId } = req.params;
      const { format, quality } = req.query;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const downloadInfo = await downloadService.downloadTrack(videoId, {
        format: format || 'mp3',
        quality: quality || '0',
      });

      res.json({
        success: true,
        download: downloadInfo,
        message: 'Download completed successfully',
      });
    } catch (error) {
      console.error('Download track error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async downloadPlaylist(req, res) {
    try {
      const { playlistId } = req.params;
      const { format, quality } = req.query;
      
      if (!playlistId) {
        return res.status(400).json({ error: 'Playlist ID is required' });
      }

      // Start playlist download asynchronously
      downloadService.downloadPlaylist(playlistId, {
        format: format || 'mp3',
        quality: quality || '0',
      }).catch(error => {
        console.error('Playlist download error:', error);
      });

      // Return immediately with download ID
      const downloads = downloadService.getAllDownloads();
      const currentDownload = downloads.find(d => d.playlistId === playlistId);

      res.json({
        success: true,
        message: 'Playlist download started',
        download: currentDownload,
      });
    } catch (error) {
      console.error('Start playlist download error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async getDownloadStatus(req, res) {
    try {
      const { downloadId } = req.params;
      
      const downloadInfo = downloadService.getDownloadStatus(downloadId);
      
      if (!downloadInfo) {
        return res.status(404).json({ 
          error: 'Download not found',
          success: false,
        });
      }

      res.json({
        success: true,
        download: downloadInfo,
      });
    } catch (error) {
      console.error('Get download status error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async getAllDownloads(req, res) {
    try {
      const downloads = downloadService.getAllDownloads();
      
      res.json({
        success: true,
        downloads,
        count: downloads.length,
      });
    } catch (error) {
      console.error('Get all downloads error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async cancelDownload(req, res) {
    try {
      const { downloadId } = req.params;
      
      const success = await downloadService.cancelDownload(downloadId);
      
      if (!success) {
        return res.status(404).json({ 
          error: 'Download not found',
          success: false,
        });
      }

      res.json({
        success: true,
        message: 'Download cancelled successfully',
      });
    } catch (error) {
      console.error('Cancel download error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async getDownloadedFiles(req, res) {
    try {
      const files = await downloadService.getDownloadedFiles();
      
      res.json({
        success: true,
        files,
        count: files.length,
      });
    } catch (error) {
      console.error('Get downloaded files error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }

  async downloadFile(req, res) {
    try {
      const { filename } = req.params;

      // Sanitize filename to prevent path traversal attacks.
      const safeFilename = path.basename(filename);

      // This is a critical security check.
      // It ensures that even if the filename is manipulated, the resulting path
      // cannot point to a file outside of the designated downloads directory.
      const intendedPath = path.join(downloadService.downloadsDir, safeFilename);
      
      // Resolve the absolute path to be extra safe.
      const resolvedPath = path.resolve(intendedPath);
      const resolvedDownloadsDir = path.resolve(downloadService.downloadsDir);

      if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
        return res.status(403).json({
          error: 'Forbidden',
          success: false,
        });
      }
      
      res.download(resolvedPath, safeFilename, (error) => {
        if (error && !res.headersSent) {
          console.error('File download error:', error);
          res.status(404).json({
            error: 'File not found',
            success: false,
          });
        }
      });
    } catch (error) {
      console.error('Download file error:', error);
      // Avoid leaking internal error details to the client.
      res.status(500).json({ 
        error: 'An internal server error occurred',
        success: false,
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { filename } = req.params;
      
      const success = await downloadService.deleteDownload(filename);
      
      if (!success) {
        return res.status(404).json({ 
          error: 'File not found',
          success: false,
        });
      }

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ 
        error: error.message,
        success: false,
      });
    }
  }
}

module.exports = new DownloadController();
