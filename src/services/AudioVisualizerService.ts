import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export type VisualizerType = 'bars' | 'wave' | 'circular' | 'spectrum';

export interface AudioData {
  frequencyData: number[];
  timeDomainData: number[];
  volume: number;
}

class AudioVisualizerService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private timeDataArray: Uint8Array<ArrayBuffer> | null = null;
  private animationFrame: number | null = null;
  private isInitialized: boolean = false;
  private callbacks: ((data: AudioData) => void)[] = [];

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Only initialize on web platform
      if (Platform.OS === 'web') {
        // @ts-ignore - Web Audio API
        this.audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        this.analyser = this.audioContext.createAnalyser();

        // Configure analyser
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(
          new ArrayBuffer(bufferLength)
        ) as Uint8Array<ArrayBuffer>;
        this.timeDataArray = new Uint8Array(
          new ArrayBuffer(bufferLength)
        ) as Uint8Array<ArrayBuffer>;

        this.isInitialized = true;
        console.log('AudioVisualizerService initialized');
      } else {
        // For native platforms, use a simplified approach
        this.isInitialized = true;
        this.startNativeVisualization();
      }
    } catch (error) {
      console.error('Error initializing AudioVisualizerService:', error);
    }
  }

  async connectToAudioElement(audioElement: HTMLAudioElement) {
    if (!this.audioContext || !this.analyser) return;

    try {
      const source = this.audioContext.createMediaElementSource(audioElement);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.startVisualization();
    } catch (error) {
      console.error('Error connecting to audio element:', error);
    }
  }

  private startVisualization() {
    if (!this.analyser || !this.dataArray || !this.timeDataArray) return;

    const update = () => {
      if (!this.analyser || !this.dataArray || !this.timeDataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);
      this.analyser.getByteTimeDomainData(this.timeDataArray);

      const frequencyData = Array.from(this.dataArray);
      const timeDomainData = Array.from(this.timeDataArray);

      // Calculate volume
      const sum = frequencyData.reduce((a, b) => a + b, 0);
      const volume = sum / frequencyData.length / 255;

      const audioData: AudioData = {
        frequencyData,
        timeDomainData,
        volume,
      };

      // Notify all callbacks
      this.callbacks.forEach((callback) => callback(audioData));

      this.animationFrame = requestAnimationFrame(update);
    };

    update();
  }

  private startNativeVisualization() {
    // For native platforms, generate mock data
    const update = () => {
      const frequencyData = Array.from(
        { length: 128 },
        () => Math.random() * 255
      );
      const timeDomainData = Array.from(
        { length: 128 },
        () => Math.random() * 255
      );
      const volume = Math.random();

      const audioData: AudioData = {
        frequencyData,
        timeDomainData,
        volume,
      };

      this.callbacks.forEach((callback) => callback(audioData));

      this.animationFrame = requestAnimationFrame(update);
    };

    update();
  }

  subscribe(callback: (data: AudioData) => void): () => void {
    this.callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  cleanup() {
    this.stop();
    this.callbacks = [];

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.timeDataArray = null;
    this.isInitialized = false;
  }

  // Helper methods for different visualizer types
  getBarData(data: AudioData, barCount: number = 32): number[] {
    const { frequencyData } = data;
    const step = Math.floor(frequencyData.length / barCount);
    const bars: number[] = [];

    for (let i = 0; i < barCount; i++) {
      const start = i * step;
      const end = start + step;
      const slice = frequencyData.slice(start, end);
      const average = slice.reduce((a, b) => a + b, 0) / slice.length;
      bars.push(average / 255);
    }

    return bars;
  }

  getWaveData(data: AudioData, points: number = 128): number[] {
    const { timeDomainData } = data;
    const step = Math.floor(timeDomainData.length / points);
    const wave: number[] = [];

    for (let i = 0; i < points; i++) {
      const index = i * step;
      wave.push(timeDomainData[index] / 255);
    }

    return wave;
  }

  getCircularData(data: AudioData, segments: number = 64): number[] {
    const { frequencyData } = data;
    const step = Math.floor(frequencyData.length / segments);
    const circular: number[] = [];

    for (let i = 0; i < segments; i++) {
      const index = i * step;
      circular.push(frequencyData[index] / 255);
    }

    return circular;
  }

  getSpectrumData(data: AudioData): { low: number; mid: number; high: number } {
    const { frequencyData } = data;
    const length = frequencyData.length;

    const lowEnd = Math.floor(length * 0.1);
    const midEnd = Math.floor(length * 0.5);

    const low =
      frequencyData.slice(0, lowEnd).reduce((a, b) => a + b, 0) / lowEnd / 255;
    const mid =
      frequencyData.slice(lowEnd, midEnd).reduce((a, b) => a + b, 0) /
      (midEnd - lowEnd) /
      255;
    const high =
      frequencyData.slice(midEnd).reduce((a, b) => a + b, 0) /
      (length - midEnd) /
      255;

    return { low, mid, high };
  }
}

export default new AudioVisualizerService();
