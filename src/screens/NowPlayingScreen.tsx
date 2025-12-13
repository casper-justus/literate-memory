import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useMusicPlayer } from '../context/MusicPlayerContext';

const { width } = Dimensions.get('window');

export default function NowPlayingScreen() {
  const {
    playerState,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setRepeatMode,
    toggleShuffle,
  } = useMusicPlayer();

  const { currentTrack, isPlaying, position, duration, repeatMode, shuffleMode } = playerState;

  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    if (!isSeeking) {
      setSliderValue(position);
    }
  }, [position, isSeeking]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderComplete = (value: number) => {
    setIsSeeking(false);
    seekTo(value);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return '🔂';
      case 'all':
        return '🔁';
      default:
        return '🔁';
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No track playing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.artworkContainer}>
        {currentTrack.thumbnail ? (
          <Image
            source={{ uri: currentTrack.thumbnail }}
            style={styles.artwork}
          />
        ) : (
          <View style={[styles.artwork, styles.placeholderArtwork]}>
            <Text style={styles.placeholderText}>🎵</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={sliderValue}
          onValueChange={handleSliderChange}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#333333"
          thumbTintColor="#007AFF"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleShuffle}
        >
          <Text style={[styles.controlIcon, shuffleMode && styles.activeIcon]}>
            🔀
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={previousTrack}
        >
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={isPlaying ? pauseTrack : resumeTrack}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={nextTrack}
        >
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={cycleRepeatMode}
        >
          <Text style={[styles.controlIcon, repeatMode !== 'off' && styles.activeIcon]}>
            {getRepeatIcon()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 18,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  artwork: {
    width: width - 80,
    height: width - 80,
    borderRadius: 12,
  },
  placeholderArtwork: {
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  sliderContainer: {
    marginBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  activeIcon: {
    color: '#007AFF',
  },
});
