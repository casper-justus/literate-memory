import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useMusicPlayer } from '../context/MusicPlayerContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MiniPlayer() {
  const navigation = useNavigation<NavigationProp>();
  const { playerState, pauseTrack, resumeTrack, nextTrack } = useMusicPlayer();
  const { currentTrack, isPlaying } = playerState;

  if (!currentTrack) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('NowPlaying')}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {currentTrack.thumbnail && (
          <Image
            source={{ uri: currentTrack.thumbnail }}
            style={styles.thumbnail}
          />
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              isPlaying ? pauseTrack() : resumeTrack();
            }}
            style={styles.controlButton}
          >
            <Text style={styles.controlIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            style={styles.controlButton}
          >
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});
