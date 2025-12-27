import { Audio, PlaybackStatus } from 'expo-audio';
import { Track } from '../types/music';

export class AudioPlayerService {
  private player: Audio.Player;
  private currentTrack: Track | null = null;
  private onStatusUpdate?: (status: PlaybackStatus) => void;
  private onTrackEnd?: () => void;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.player = new Audio.Player();
  }

  async initialize() {
    try {
      await Audio.requestPermissionsAsync();
    } catch (error) {
      console.error('Audio initialization error:', error);
    }
  }

  async loadTrack(track: Track, autoPlay: boolean = true): Promise<boolean> {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    let resolveLoading: () => void;
    this.loadingPromise = new Promise((resolve) => {
      resolveLoading = resolve;
    });

    try {
      const status = await this.player.getStatusAsync();
      if (status?.isLoaded) {
        await this.player.stopAsync();
        await this.player.unloadAsync();
      }

      if (!track.url) {
        console.error('Track URL is missing');
        return false;
      }

      await this.player.loadAsync(
        { uri: track.url },
        { shouldPlay: autoPlay },
        true // Stay active in background
      );

      this.currentTrack = track;

      return true;
    } catch (error) {
      console.error('Load track error:', error);
      return false;
    } finally {
      this.loadingPromise = null;
      resolveLoading!();
    }
  }

  async play() {
    try {
      await this.player.playAsync();
    } catch (error) {
      console.error('Play error:', error);
    }
  }

  async pause() {
    try {
      await this.player.pauseAsync();
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  async stop() {
    try {
      await this.player.stopAsync();
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  async seekTo(positionMillis: number) {
    try {
      await this.player.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  async setVolume(volume: number) {
    try {
      await this.player.setVolumeAsync(volume);
    } catch (error) {
      console.error('Set volume error:', error);
    }
  }

  async getStatus(): Promise<PlaybackStatus | null> {
    try {
      return await this.player.getStatusAsync();
    } catch (error) {
      console.error('Get status error:', error);
      return null;
    }
  }

  addListener(callback: (status: PlaybackStatus) => void) {
    this.player.addListener(callback);
  }

  async setActiveLockScreenControls(track: Track) {
    try {
      await this.player.setActiveLockScreenControlsAsync(true, {
        metadata: {
          title: track.title,
          artist: track.artist,
          album: track.album || '',
          artwork: { uri: track.artwork, width: 512, height: 512 },
        },
        options: { color: '#FF0000' },
      });
    } catch (error) {
      console.error('Error setting lock screen controls:', error);
    }
  }

  setOnRemoteControlEvent(callback: (event: any) => void) {
    this.player.setOnRemoteControlEvent(callback);
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  async cleanup() {
    try {
      await this.player.unloadAsync();
      this.currentTrack = null;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export default new AudioPlayerService();
