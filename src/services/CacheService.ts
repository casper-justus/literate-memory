import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../types/music';

interface CachedTrack {
  track: Track;
  fileUri: string;
  cachedAt: number;
  size: number;
}

class CacheService {
  private cacheDir: string;
  private maxCacheSize: number = 500 * 1024 * 1024; // 500MB
  private cacheIndexKey = '@cache_index';

  constructor() {
    this.cacheDir = `${FileSystem.documentDirectory}cache/`;
    this.ensureCacheDir();
  }

  private async ensureCacheDir() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error('Error creating cache directory:', error);
    }
  }

  private getTrackCachePath(trackId: string): string {
    return `${this.cacheDir}${trackId}.mp3`;
  }

  async cacheTrack(track: Track, audioUrl: string): Promise<string | null> {
    try {
      const cachePath = this.getTrackCachePath(track.id);

      // Check if already cached
      const fileInfo = await FileSystem.getInfoAsync(cachePath);
      if (fileInfo.exists) {
        return cachePath;
      }

      // Download and cache
      const downloadResult = await FileSystem.downloadAsync(
        audioUrl,
        cachePath
      );

      if (downloadResult.status === 200) {
        // Update cache index
        await this.updateCacheIndex(track, cachePath, downloadResult.headers['content-length'] || '0');

        // Check and cleanup if needed
        await this.cleanupIfNeeded();

        return cachePath;
      }

      return null;
    } catch (error) {
      console.error('Error caching track:', error);
      return null;
    }
  }

  async getCachedTrack(trackId: string): Promise<string | null> {
    try {
      const cachePath = this.getTrackCachePath(trackId);
      const fileInfo = await FileSystem.getInfoAsync(cachePath);

      if (fileInfo.exists) {
        return cachePath;
      }

      return null;
    } catch (error) {
      console.error('Error getting cached track:', error);
      return null;
    }
  }

  async isCached(trackId: string): Promise<boolean> {
    const cachePath = await this.getCachedTrack(trackId);
    return cachePath !== null;
  }

  async removeCachedTrack(trackId: string): Promise<boolean> {
    try {
      const cachePath = this.getTrackCachePath(trackId);
      const fileInfo = await FileSystem.getInfoAsync(cachePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(cachePath);
        await this.removeFromCacheIndex(trackId);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing cached track:', error);
      return false;
    }
  }

  async getCachedTracks(): Promise<CachedTrack[]> {
    try {
      const indexJson = await AsyncStorage.getItem(this.cacheIndexKey);
      if (indexJson) {
        return JSON.parse(indexJson);
      }
      return [];
    } catch (error) {
      console.error('Error getting cached tracks:', error);
      return [];
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      const cachedTracks = await this.getCachedTracks();
      return cachedTracks.reduce((total, track) => total + track.size, 0);
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  async clearCache(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
        await FileSystem.makeDirectoryAsync(this.cacheDir, {
          intermediates: true,
        });
      }
      await AsyncStorage.removeItem(this.cacheIndexKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  private async updateCacheIndex(
    track: Track,
    fileUri: string,
    sizeStr: string
  ): Promise<void> {
    try {
      const cachedTracks = await this.getCachedTracks();
      
      const newCachedTrack: CachedTrack = {
        track,
        fileUri,
        cachedAt: Date.now(),
        size: parseInt(sizeStr, 10) || 0,
      };

      // Remove existing entry if present
      const filtered = cachedTracks.filter((t) => t.track.id !== track.id);
      filtered.push(newCachedTrack);

      await AsyncStorage.setItem(
        this.cacheIndexKey,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error updating cache index:', error);
    }
  }

  private async removeFromCacheIndex(trackId: string): Promise<void> {
    try {
      const cachedTracks = await this.getCachedTracks();
      const filtered = cachedTracks.filter((t) => t.track.id !== trackId);
      await AsyncStorage.setItem(this.cacheIndexKey, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from cache index:', error);
    }
  }

  private async cleanupIfNeeded(): Promise<void> {
    try {
      const totalSize = await this.getCacheSize();

      if (totalSize > this.maxCacheSize) {
        // Remove oldest cached tracks until under limit
        const cachedTracks = await this.getCachedTracks();
        cachedTracks.sort((a, b) => a.cachedAt - b.cachedAt); // Oldest first

        let currentSize = totalSize;
        for (const cachedTrack of cachedTracks) {
          if (currentSize <= this.maxCacheSize * 0.8) break; // Keep 80% of max

          await this.removeCachedTrack(cachedTrack.track.id);
          currentSize -= cachedTrack.size;
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async preloadTrack(track: Track, audioUrl: string): Promise<void> {
    // Preload in background without blocking
    this.cacheTrack(track, audioUrl).catch((error) => {
      console.error('Error preloading track:', error);
    });
  }

  async preloadPlaylist(tracks: Track[], getAudioUrl: (track: Track) => Promise<string>): Promise<void> {
    // Preload multiple tracks
    for (const track of tracks) {
      try {
        const audioUrl = await getAudioUrl(track);
        await this.preloadTrack(track, audioUrl);
      } catch (error) {
        console.error(`Error preloading track ${track.id}:`, error);
      }
    }
  }
}

export default new CacheService();
