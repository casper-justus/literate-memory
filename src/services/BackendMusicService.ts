import axios from 'axios';
import { SearchResult } from '../types/music';

const API_BASE = __DEV__ 
  ? 'http://localhost:3000/api/music' 
  : 'https://your-backend-url.com/api/music';

class BackendMusicService {
  private apiBase: string;

  constructor(apiBase?: string) {
    this.apiBase = apiBase || API_BASE;
  }

  async search(query: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${this.apiBase}/search`, {
        params: { query, limit },
        timeout: 30000,
      });

      return response.data.results.map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnail: item.thumbnail,
        duration: item.duration,
        viewCount: item.viewCount,
      }));
    } catch (error) {
      console.error('Backend search error:', error);
      throw new Error('Failed to search. Please check if backend is running.');
    }
  }

  async getVideoInfo(videoId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiBase}/video/${videoId}`, {
        timeout: 15000,
      });
      return response.data;
    } catch (error) {
      console.error('Backend get video info error:', error);
      return null;
    }
  }

  async getAudioUrl(videoId: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.apiBase}/audio/${videoId}`, {
        timeout: 15000,
      });
      return response.data.url;
    } catch (error) {
      console.error('Backend get audio URL error:', error);
      return null;
    }
  }

  async getTrending(region: string = 'US'): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${this.apiBase}/trending`, {
        params: { region },
        timeout: 30000,
      });

      return response.data.results.map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnail: item.thumbnail,
        duration: item.duration,
        viewCount: item.viewCount,
      }));
    } catch (error) {
      console.error('Backend get trending error:', error);
      return [];
    }
  }

  async checkHealth(): Promise<{ status: string; ytdlp: any }> {
    try {
      const response = await axios.get(`${this.apiBase}/health`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('Backend health check error:', error);
      return { status: 'error', ytdlp: { installed: false } };
    }
  }

  getStreamUrl(videoId: string): string {
    return `${this.apiBase}/stream/${videoId}`;
  }

  parseDurationToSeconds(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  }
}

// Export both the class and a default instance
const defaultInstance = new BackendMusicService();
export { BackendMusicService };
export default defaultInstance;
