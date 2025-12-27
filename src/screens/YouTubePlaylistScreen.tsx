import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Track, YouTubePlaylist } from '../types/music';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Button } from '../components';

type YouTubePlaylistRouteProp = RouteProp<RootStackParamList, 'YouTubePlaylist'>;

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function YouTubePlaylistScreen() {
  const route = useRoute<YouTubePlaylistRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { playlistId } = route.params;

  const { getYouTubePlaylist, playQueue } = useMusicPlayer();

  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<YouTubePlaylist | null>(null);

  const playlistTitle = useMemo(() => route.params?.title || playlist?.title, [playlist?.title, route.params]);

  useEffect(() => {
    if (playlistTitle) {
      navigation.setOptions({ title: playlistTitle });
    }
  }, [navigation, playlistTitle]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getYouTubePlaylist(playlistId);
        setPlaylist(data);
      } catch (e) {
        console.error('Load playlist error:', e);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getYouTubePlaylist, playlistId]);

  const handlePlayAll = async () => {
    if (!playlist || playlist.tracks.length === 0) {
      Alert.alert('Empty playlist', 'No tracks found in this playlist.');
      return;
    }

    await playQueue(playlist.tracks, 0, null);
  };

  const handlePlayTrack = async (index: number) => {
    if (!playlist) {
      return;
    }

    await playQueue(playlist.tracks, index, null);
  };

  const renderTrackItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handlePlayTrack(index)}
      activeOpacity={0.8}
    >
      <Text style={styles.trackNumber}>{index + 1}</Text>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Ionicons name="musical-notes" size={18} color="#666666" />
        </View>
      )}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading playlist...</Text>
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load playlist</Text>
        <Text style={styles.errorSubtext}>Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playlistHeader}>
          <View style={styles.playlistIcon}>
            <Ionicons name="logo-youtube" size={34} color="#FFFFFF" />
          </View>
          <View style={styles.playlistHeaderInfo}>
            <Text style={styles.playlistName} numberOfLines={2}>
              {playlist.title}
            </Text>
            <Text style={styles.playlistMeta} numberOfLines={1}>
              {playlist.author} • {playlist.tracks.length} tracks
            </Text>
          </View>
        </View>

        <Button
          title="Play All"
          onPress={handlePlayAll}
          variant="primary"
          style={styles.playAllButton}
        />
      </View>

      <FlatList
        data={playlist.tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tracks found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  playlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistHeaderInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  playlistMeta: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  playAllButton: {
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 150,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  trackNumber: {
    color: '#666666',
    fontSize: 14,
    width: 30,
    textAlign: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#1A1A1A',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#AAAAAA',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
  },
});
