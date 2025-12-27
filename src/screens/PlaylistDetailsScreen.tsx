import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Track } from '../types/music';
import { Button } from '../components';

type PlaylistDetailsRouteProp = RouteProp<RootStackParamList, 'PlaylistDetails'>;

export default function PlaylistDetailsScreen() {
  const route = useRoute<PlaylistDetailsRouteProp>();
  const { playlistId } = route.params;
  
  const {
    playlists,
    removeTrackFromPlaylist,
    playPlaylist,
    playQueue,
  } = useMusicPlayer();

  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Playlist not found</Text>
      </View>
    );
  }

  const handlePlayTrack = async (index: number) => {
    await playQueue(playlist.tracks, index, playlist);
  };

  const handleRemoveTrack = (trackId: string, trackTitle: string) => {
    Alert.alert(
      'Remove Track',
      `Remove "${trackTitle}" from playlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeTrackFromPlaylist(playlistId, trackId),
        },
      ]
    );
  };

  const handlePlayAll = () => {
    if (playlist.tracks.length === 0) {
      Alert.alert('Empty Playlist', 'Add some tracks first');
      return;
    }
    playPlaylist(playlist);
  };

  const openTrackMenu = (track: Track, index: number) => {
    Alert.alert(track.title, 'Choose action', [
      { text: 'Play', onPress: () => handlePlayTrack(index) },
      {
        text: 'Remove from Playlist',
        onPress: () => handleRemoveTrack(track.id, track.title),
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderTrackItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handlePlayTrack(index)}
      activeOpacity={0.85}
    >
      <Text style={styles.trackNumber}>{index + 1}</Text>
      {item.thumbnail && (
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      )}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          openTrackMenu(item, index);
        }}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playlistHeader}>
          <View style={styles.playlistIcon}>
            <Ionicons name="musical-notes" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.playlistHeaderInfo}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            <Text style={styles.playlistMeta}>
              {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
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
            <Text style={styles.emptyText}>No tracks in this playlist</Text>
            <Text style={styles.emptySubtext}>
              Search for music and add tracks to this playlist
            </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
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
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
