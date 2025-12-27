import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Path, Circle, Line } from 'react-native-svg';
import AudioVisualizerService, {
  AudioData,
} from '../services/AudioVisualizerService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AudioVisualizerProps {
  type?: 'bars' | 'wave' | 'circular' | 'spectrum';
  color?: string;
  barCount?: number;
  height?: number;
  isPlaying?: boolean;
}

export default function AudioVisualizer({
  type = 'bars',
  color = '#007AFF',
  barCount = 32,
  height = 200,
  isPlaying = false,
}: AudioVisualizerProps) {
  const [audioData, setAudioData] = useState<AudioData>({
    frequencyData: Array(128).fill(0),
    timeDomainData: Array(128).fill(128),
    volume: 0,
  });

  useEffect(() => {
    if (!isPlaying) return;

    AudioVisualizerService.initialize();

    const unsubscribe = AudioVisualizerService.subscribe((data) => {
      setAudioData(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isPlaying]);

  const renderBars = () => {
    const bars = AudioVisualizerService.getBarData(audioData, barCount);
    const barWidth = (SCREEN_WIDTH - 40) / barCount;
    const gap = 2;

    return (
      <Svg width={SCREEN_WIDTH - 40} height={height}>
        {bars.map((value, index) => {
          const barHeight = Math.max(value * height, 2);
          const x = index * barWidth;
          const y = height - barHeight;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth - gap}
              height={barHeight}
              fill={color}
              opacity={0.8}
            />
          );
        })}
      </Svg>
    );
  };

  const renderWave = () => {
    const points = 128;
    const wave = AudioVisualizerService.getWaveData(audioData, points);
    const stepX = (SCREEN_WIDTH - 40) / points;

    let pathData = `M 0 ${height / 2}`;

    wave.forEach((value, index) => {
      const x = index * stepX;
      const y = value * height;
      pathData += ` L ${x} ${y}`;
    });

    return (
      <Svg width={SCREEN_WIDTH - 40} height={height}>
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={2}
          fill="none"
          opacity={0.8}
        />
      </Svg>
    );
  };

  const renderCircular = () => {
    const segments = 64;
    const circular = AudioVisualizerService.getCircularData(
      audioData,
      segments
    );
    const centerX = (SCREEN_WIDTH - 40) / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    return (
      <Svg width={SCREEN_WIDTH - 40} height={height}>
        {circular.map((value, index) => {
          const angle = (index / segments) * 2 * Math.PI;
          const length = radius + value * radius * 0.5;

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * length;
          const y2 = centerY + Math.sin(angle) * length;

          return (
            <Line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={2}
              opacity={0.8}
            />
          );
        })}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.3}
          fill={color}
          opacity={0.3}
        />
      </Svg>
    );
  };

  const renderSpectrum = () => {
    const spectrum = AudioVisualizerService.getSpectrumData(audioData);
    const bandWidth = (SCREEN_WIDTH - 40) / 3;
    const gap = 10;

    const bands = [
      { label: 'LOW', value: spectrum.low, color: '#FF3B30' },
      { label: 'MID', value: spectrum.mid, color: '#34C759' },
      { label: 'HIGH', value: spectrum.high, color: '#007AFF' },
    ];

    return (
      <Svg width={SCREEN_WIDTH - 40} height={height}>
        {bands.map((band, index) => {
          const barHeight = Math.max(band.value * height, 2);
          const x = index * bandWidth + gap;
          const y = height - barHeight;

          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={bandWidth - gap * 2}
              height={barHeight}
              fill={band.color}
              opacity={0.7}
            />
          );
        })}
      </Svg>
    );
  };

  const renderVisualizer = () => {
    if (!isPlaying) {
      return renderBars(); // Show static bars when not playing
    }

    switch (type) {
      case 'bars':
        return renderBars();
      case 'wave':
        return renderWave();
      case 'circular':
        return renderCircular();
      case 'spectrum':
        return renderSpectrum();
      default:
        return renderBars();
    }
  };

  return (
    <View style={[styles.container, { height }]}>{renderVisualizer()}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
