import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components';
import { SearchResult, Track } from '../types/music';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { playTrack, addToQueue, playlists, addTrackToPlaylist, searchMusic, getTrendingMusic, getAudioUrl } = useMusicPlayer();

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchMusic(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    setLoading(true);
    try {
      const trending = await getTrendingMusic();
      setResults(trending);
    } catch (error) {
      console.error('Load trending error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (result: SearchResult) => {
    const track: Track = {
      id: result.videoId,
      title: result.title,
      artist: result.channelTitle,
      duration: parseDurationToSeconds(result.duration),
      thumbnail: result.thumbnail,
      videoId: result.videoId,
    };

    await playTrack(track);
  };

  const handleAddToQueue = (result: SearchResult) => {
    const track: Track = {
      id: result.videoId,
      title: result.title,
      artist: result.channelTitle,
      duration: parseDurationToSeconds(result.duration),
      thumbnail: result.thumbnail,
      videoId: result.videoId,
    };

    addToQueue(track);
    Alert.alert('Added to Queue', `${track.title} added to queue`);
  };

  const handleAddToPlaylist = (result: SearchResult) => {
    const track: Track = {
      id: result.videoId,
      title: result.title,
      artist: result.channelTitle,
      duration: parseDurationToSeconds(result.duration),
      thumbnail: result.thumbnail,
      videoId: result.videoId,
    };

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

    Alert.alert(
      'Add to Playlist',
      'Select a playlist',
      buttons
    );
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlayTrack(item)}
      onLongPress={() => {
        Alert.alert(
          item.title,
          'Choose action',
          [
            { text: 'Play Now', onPress: () => handlePlayTrack(item) },
            { text: 'Add to Queue', onPress: () => handleAddToQueue(item) },
            { text: 'Add to Playlist', onPress: () => handleAddToPlaylist(item) },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      }}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.resultArtist} numberOfLines={1}>
          {item.channelTitle}
        </Text>
        <Text style={styles.resultDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    loadTrending();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search for music..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.videoId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {query ? 'No results found' : 'Search for music or browse trending'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    color: '#FFFFFF',
  },
  searchButton: {
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#AAAAAA',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 150,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultArtist: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 4,
  },
  resultDuration: {
    color: '#666666',
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
  },
});
