import axios from 'axios';
import { SearchResult, Track, YouTubePlaylist } from '../types/music';

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

  async getPlaylist(playlistId: string): Promise<YouTubePlaylist | null> {
    try {
      const response = await axios.get(`${this.apiBase}/playlist/${playlistId}`, {
        timeout: 30000,
      });

      const data = response.data;
      const tracks: Track[] = (data.tracks || []).map((t: any) => ({
        id: t.videoId,
        title: t.title,
        artist: t.channelTitle || data.author || 'Unknown',
        duration: typeof t.durationSeconds === 'number' ? t.durationSeconds : 0,
        thumbnail: t.thumbnail,
        videoId: t.videoId,
      }));

      return {
        playlistId: data.playlistId || playlistId,
        title: data.title,
        author: data.author,
        description: data.description,
        thumbnail: data.thumbnail,
        videoCount: typeof data.videoCount === 'number' ? data.videoCount : tracks.length,
        tracks,
      };
    } catch (error) {
      console.error('Backend get playlist error:', error);
      return null;
    }
  }

  async getLyrics(
    artist: string,
    title: string
  ): Promise<{ lyrics: string; syncedLyrics?: string; source: 'lrclib' | 'lyrics.ovh' | 'backend' } | null> {
    try {
      const response = await axios.get(`${this.apiBase}/lyrics`, {
        params: { artist, title },
        timeout: 30000,
      });

      const lyrics = response.data?.lyrics;
      if (typeof lyrics !== 'string' || lyrics.trim().length === 0) {
        return null;
      }

      const rawSource = response.data?.source;
      const source: 'lrclib' | 'lyrics.ovh' | 'backend' =
        rawSource === 'lrclib' || rawSource === 'lyrics.ovh' ? rawSource : 'backend';

      return {
        lyrics: lyrics.trim(),
        syncedLyrics:
          typeof response.data?.syncedLyrics === 'string'
            ? response.data.syncedLyrics
            : undefined,
        source,
      };
    } catch (error) {
      return null;
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
