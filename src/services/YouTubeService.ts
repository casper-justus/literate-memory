import axios from 'axios';
import {
  SearchResult,
  Track,
  YouTubePlaylist,
  YouTubePlaylistSearchResult,
} from '../types/music';

const INVIDIOUS_INSTANCES = [
  'https://invidious.io.lol/api/v1',
  'https://iv.ggtyler.dev/api/v1',
  'https://yewtu.be/api/v1',
  'https://inv.nadeko.net/api/v1',
];

const DEFAULT_TIMEOUT_MS = 20000;

const isHtmlLike = (data: unknown) =>
  typeof data === 'string' && data.trim().startsWith('<');

export class YouTubeService {
  constructor() {}

  private async invidiousGet<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    let lastError: unknown;

    for (const base of INVIDIOUS_INSTANCES) {
      try {
        const response = await axios.get(`${base}${path}`, {
          params,
          timeout: DEFAULT_TIMEOUT_MS,
          headers: {
            Accept: 'application/json',
          },
        });

        if (isHtmlLike(response.data)) {
          throw new Error('Invidious returned HTML');
        }

        return response.data as T;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  async search(
    query: string,
    maxResults: number = 20
  ): Promise<SearchResult[]> {
    try {
      const data = await this.invidiousGet<any[]>(`/search`, {
        q: query,
        type: 'video',
      });

      return data.slice(0, maxResults).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail:
          item.videoThumbnails?.[0]?.url ||
          this.getDefaultThumbnail(item.videoId),
        duration: this.formatDuration(item.lengthSeconds),
        viewCount: item.viewCount?.toString(),
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async searchPlaylists(
    query: string,
    maxResults: number = 20
  ): Promise<YouTubePlaylistSearchResult[]> {
    try {
      const data = await this.invidiousGet<any[]>(`/search`, {
        q: query,
        type: 'playlist',
      });

      return data.slice(0, maxResults).map((item: any) => ({
        playlistId: item.playlistId,
        title: item.title,
        author: item.author,
        thumbnail:
          item.playlistThumbnail ||
          item.videos?.[0]?.videoThumbnails?.[0]?.url ||
          '',
        videoCount:
          typeof item.videoCount === 'number' ? item.videoCount : undefined,
      }));
    } catch (error) {
      console.error('Playlist search error:', error);
      return [];
    }
  }

  async getVideoInfo(videoId: string): Promise<any> {
    try {
      return await this.invidiousGet<any>(`/videos/${videoId}`);
    } catch (error) {
      console.error('Get video info error:', error);
      return null;
    }
  }

  async getAudioUrl(videoId: string): Promise<string | null> {
    try {
      const videoInfo = await this.getVideoInfo(videoId);
      if (!videoInfo) return null;

      const audioFormats = videoInfo.adaptiveFormats?.filter((format: any) =>
        format.type?.includes('audio')
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
      const data = await this.invidiousGet<any[]>(`/trending`, {
        type: 'Music',
      });

      return data.slice(0, 20).map((item: any) => ({
        videoId: item.videoId,
        title: item.title,
        channelTitle: item.author,
        thumbnail:
          item.videoThumbnails?.[0]?.url ||
          this.getDefaultThumbnail(item.videoId),
        duration: this.formatDuration(item.lengthSeconds),
        viewCount: item.viewCount?.toString(),
      }));
    } catch (error) {
      console.error('Get trending error:', error);
      return [];
    }
  }

  async getPlaylist(playlistId: string): Promise<YouTubePlaylist | null> {
    try {
      const data = await this.invidiousGet<any>(`/playlists/${playlistId}`);

      const tracks: Track[] = (data.videos || []).map((video: any) => ({
        id: video.videoId,
        title: video.title,
        artist: video.author || data.author || 'Unknown',
        duration:
          typeof video.lengthSeconds === 'number' ? video.lengthSeconds : 0,
        thumbnail:
          video.videoThumbnails?.[0]?.url ||
          this.getDefaultThumbnail(video.videoId),
        videoId: video.videoId,
      }));

      return {
        playlistId,
        title: data.title,
        author: data.author,
        description: data.description,
        thumbnail:
          data.playlistThumbnail ||
          data.thumbnail ||
          tracks[0]?.thumbnail ||
          undefined,
        videoCount:
          typeof data.videoCount === 'number' ? data.videoCount : tracks.length,
        tracks,
      };
    } catch (error) {
      console.error('Get playlist error:', error);
      return null;
    }
  }

  private getDefaultThumbnail(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  private formatDuration(seconds: number): string {
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = Math.floor(safeSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
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
