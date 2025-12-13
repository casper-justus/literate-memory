import axios from 'axios';
import { SearchResult } from '../types/music';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const INVIDIOUS_API = 'https://invidious.io.lol/api/v1';

export class YouTubeService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  async search(query: string, maxResults: number = 20): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${INVIDIOUS_API}/search`, {
        params: {
          q: query,
          type: 'video',
        },
      });

      return response.data.slice(0, maxResults).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || '',
        duration: this.formatDuration(item.lengthSeconds),
        viewCount: item.viewCount?.toString(),
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async getVideoInfo(videoId: string): Promise<any> {
    try {
      const response = await axios.get(`${INVIDIOUS_API}/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Get video info error:', error);
      return null;
    }
  }

  async getAudioUrl(videoId: string): Promise<string | null> {
    try {
      const videoInfo = await this.getVideoInfo(videoId);
      if (!videoInfo) return null;

      const audioFormats = videoInfo.adaptiveFormats?.filter(
        (format: any) => format.type?.includes('audio')
      );

      if (audioFormats && audioFormats.length > 0) {
        audioFormats.sort((a: any, b: any) => {
          const bitrateA = parseInt(a.bitrate) || 0;
          const bitrateB = parseInt(b.bitrate) || 0;
          return bitrateB - bitrateA;
        });

        return audioFormats[0].url;
      }

      return null;
    } catch (error) {
      console.error('Get audio URL error:', error);
      return null;
    }
  }

  async getTrendingMusic(): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${INVIDIOUS_API}/trending`, {
        params: {
          type: 'Music',
        },
      });

      return response.data.slice(0, 20).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail: item.videoThumbnails?.[0]?.url || '',
        duration: this.formatDuration(item.lengthSeconds),
        viewCount: item.viewCount?.toString(),
      }));
    } catch (error) {
      console.error('Get trending error:', error);
      return [];
    }
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

export default new YouTubeService();
