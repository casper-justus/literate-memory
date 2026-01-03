import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Track } from '../types/music';
import { formatTime } from '../utils/formatters';
import LyricsView from '../components/LyricsView';


const { width, height } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function NowPlayingScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    playerState,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setRepeatMode,
    toggleShuffle,
    addToQueue,
    playlists,
    addTrackToPlaylist,
  } = useMusicPlayer();

  const { currentTrack, isPlaying, position, duration, repeatMode, shuffleMode } =
    playerState;

  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (!isSeeking) {
      setSliderValue(position);
    }
  }, [position, isSeeking]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderComplete = (value: number) => {
    setIsSeeking(false);
    seekTo(value);
  };

  const getRepeatIcon = (): 'repeat' | 'repeat-outline' => {
    switch (repeatMode) {
      case 'one':
        return 'repeat-outline';
      case 'all':
        return 'repeat';
      default:
        return 'repeat';
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const openAddToPlaylist = (track: Track) => {
    if (playlists.length === 0) {
      Alert.alert('No Playlists', 'Create a playlist first to add tracks.');
      return;
    }

    const buttons = playlists.map((playlist) => ({
      text: playlist.name,
      onPress: () => {
        addTrackToPlaylist(playlist.id, track);
        Alert.alert('Success', `Added to ${playlist.name}`);
      },
    }));

    buttons.push({ text: 'Cancel', onPress: () => {} });

    Alert.alert('Add to Playlist', 'Select a playlist', buttons);
  };

  const openOptions = (track: Track) => {
    Alert.alert('Options', undefined, [
      {
        text: 'View Lyrics',
        onPress: () => navigation.navigate('Lyrics', { track }),
      },
      {
        text: 'Add to Queue',
        onPress: () => addToQueue(track),
      },
      {
        text: 'Add to Playlist',
        onPress: () => openAddToPlaylist(track),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: currentTrack
        ? () => (
            <TouchableOpacity
              onPress={() => openOptions(currentTrack)}
              style={styles.headerIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )
        : undefined,
    });
  }, [currentTrack, navigation]);

  if (!currentTrack) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No track playing</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowLyrics(!showLyrics)}
          style={styles.lyricsToggle}
        >
          <Ionicons
            name="list"
            size={24}
            color={showLyrics ? '#007AFF' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {showLyrics && currentTrack.lyrics ? (
        <LyricsView
          lyrics={currentTrack.lyrics}
          currentPosition={position}
          onSeek={seekTo}
        />
      ) : (
        <>
          <View style={styles.artworkContainer}>
            {currentTrack.thumbnail ? (
              <Image
                source={{ uri: currentTrack.thumbnail }}
                style={styles.artwork}
              />
            ) : (
              <View style={[styles.artwork, styles.placeholderArtwork]}>
                <Ionicons name="musical-notes" size={80} color="#666666" />
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
        </>
      )}

      <View style={styles.bottomControls}>
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
            <Ionicons
              name="shuffle"
              size={28}
              color={shuffleMode ? '#007AFF' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={previousTrack}
          >
            <Ionicons name="play-skip-back" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? pauseTrack : resumeTrack}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={nextTrack}
          >
            <Ionicons name="play-skip-forward" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={cycleRepeatMode}
          >
            <Ionicons
              name={getRepeatIcon()}
              size={28}
              color={repeatMode !== 'off' ? '#007AFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!backgroundSource) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.container}
      blurRadius={25}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      {content}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  lyricsToggle: {
    padding: 10,
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
  headerIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  artworkContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  bottomControls: {
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
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
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
