import { Audio, AVPlaybackStatus } from 'expo-av';
import { Track } from '../types/music';

export class AudioPlayerService {
  private sound: Audio.Sound | null = null;
  private currentTrack: Track | null = null;
  private onStatusUpdate?: (status: AVPlaybackStatus) => void;
  private onTrackEnd?: () => void;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Audio initialization error:', error);
    }
  }

  async loadTrack(track: Track, autoPlay: boolean = true): Promise<boolean> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      if (!track.url) {
        console.error('Track URL is missing');
        return false;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: autoPlay },
        this.handlePlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.currentTrack = track;

      return true;
    } catch (error) {
      console.error('Load track error:', error);
      return false;
    }
  }

  async play() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('Play error:', error);
    }
  }

  async pause() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  async stop() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  async seekTo(positionMillis: number) {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(positionMillis);
      }
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  async setVolume(volume: number) {
    try {
      if (this.sound) {
        await this.sound.setVolumeAsync(volume);
      }
    } catch (error) {
      console.error('Set volume error:', error);
    }
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    try {
      if (this.sound) {
        return await this.sound.getStatusAsync();
      }
      return null;
    } catch (error) {
      console.error('Get status error:', error);
      return null;
    }
  }

  setStatusUpdateCallback(callback: (status: AVPlaybackStatus) => void) {
    this.onStatusUpdate = callback;
  }

  setTrackEndCallback(callback: () => void) {
    this.onTrackEnd = callback;
  }

  private handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (this.onStatusUpdate) {
      this.onStatusUpdate(status);
    }

    if (status.isLoaded && status.didJustFinish && this.onTrackEnd) {
      this.onTrackEnd();
    }
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.currentTrack = null;
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export default new AudioPlayerService();
