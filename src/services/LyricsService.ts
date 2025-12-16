import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../types/music';

interface LyricsResult {
  lyrics: string;
  source: string;
  synced: boolean;
  lines?: LyricsLine[];
}

interface LyricsLine {
  time: number;
  text: string;
}

class LyricsService {
  private cacheKey = '@lyrics_cache';
  private cache: Map<string, LyricsResult> = new Map();

  constructor() {
    this.loadCache();
  }

  private async loadCache() {
    try {
      const cacheJson = await AsyncStorage.getItem(this.cacheKey);
      if (cacheJson) {
        const cacheArray = JSON.parse(cacheJson);
        this.cache = new Map(cacheArray);
      }
    } catch (error) {
      console.error('Error loading lyrics cache:', error);
    }
  }

  private async saveCache() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      await AsyncStorage.setItem(this.cacheKey, JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Error saving lyrics cache:', error);
    }
  }

  async getLyrics(track: Track): Promise<LyricsResult | null> {
    // Check cache first
    const cacheKey = `${track.artist}-${track.title}`.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Try multiple sources
    let lyrics = await this.fetchFromLyricsOvh(track);
    if (!lyrics) {
      lyrics = await this.fetchFromLrclib(track);
    }
    if (!lyrics) {
      lyrics = await this.fetchFromYouTubeDescription(track);
    }

    if (lyrics) {
      this.cache.set(cacheKey, lyrics);
      await this.saveCache();
    }

    return lyrics;
  }

  private async fetchFromLyricsOvh(track: Track): Promise<LyricsResult | null> {
    try {
      const artist = encodeURIComponent(track.artist);
      const title = encodeURIComponent(track.title);
      
      const response = await axios.get(
        `https://api.lyrics.ovh/v1/${artist}/${title}`,
        { timeout: 5000 }
      );

      if (response.data && response.data.lyrics) {
        return {
          lyrics: response.data.lyrics,
          source: 'lyrics.ovh',
          synced: false,
        };
      }

      return null;
    } catch (error) {
      console.log('Lyrics.ovh fetch failed:', error);
      return null;
    }
  }

  private async fetchFromLrclib(track: Track): Promise<LyricsResult | null> {
    try {
      const params = {
        artist_name: track.artist,
        track_name: track.title,
        album_name: track.album || '',
        duration: track.duration || 0,
      };

      const response = await axios.get('https://lrclib.net/api/get', {
        params,
        timeout: 5000,
      });

      if (response.data) {
        const data = response.data;
        
        // Check for synced lyrics
        if (data.syncedLyrics) {
          const lines = this.parseLRC(data.syncedLyrics);
          return {
            lyrics: data.syncedLyrics,
            source: 'lrclib',
            synced: true,
            lines,
          };
        }

        // Fall back to plain lyrics
        if (data.plainLyrics) {
          return {
            lyrics: data.plainLyrics,
            source: 'lrclib',
            synced: false,
          };
        }
      }

      return null;
    } catch (error) {
      console.log('LRClib fetch failed:', error);
      return null;
    }
  }

  private async fetchFromYouTubeDescription(track: Track): Promise<LyricsResult | null> {
    // Try to extract lyrics from YouTube video description
    // This would require your backend API
    try {
      const response = await axios.get(
        `http://localhost:3000/api/music/video/${track.id}`,
        { timeout: 5000 }
      );

      if (response.data && response.data.description) {
        const description = response.data.description;
        
        // Check if description contains lyrics
        // Simple heuristic: if it has multiple lines and common lyrics markers
        if (
          description.split('\n').length > 10 &&
          (description.toLowerCase().includes('lyrics') ||
            description.toLowerCase().includes('verse') ||
            description.toLowerCase().includes('chorus'))
        ) {
          return {
            lyrics: description,
            source: 'youtube-description',
            synced: false,
          };
        }
      }

      return null;
    } catch (error) {
      console.log('YouTube description fetch failed:', error);
      return null;
    }
  }

  private parseLRC(lrcText: string): LyricsLine[] {
    const lines: LyricsLine[] = [];
    const lrcLines = lrcText.split('\n');

    for (const line of lrcLines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const centiseconds = parseInt(match[3].padEnd(3, '0'), 10);
        const text = match[4].trim();

        const time = minutes * 60 + seconds + centiseconds / 1000;
        lines.push({ time, text });
      }
    }

    return lines;
  }

  getCurrentLine(lines: LyricsLine[], currentTime: number): number {
    if (!lines || lines.length === 0) return -1;

    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].time) {
        return i;
      }
    }

    return -1;
  }

  async searchLyrics(query: string): Promise<any[]> {
    try {
      const response = await axios.get('https://lrclib.net/api/search', {
        params: { q: query },
        timeout: 5000,
      });

      return response.data || [];
    } catch (error) {
      console.error('Error searching lyrics:', error);
      return [];
    }
  }

  async clearCache() {
    this.cache.clear();
    await AsyncStorage.removeItem(this.cacheKey);
  }
}

export default new LyricsService();
