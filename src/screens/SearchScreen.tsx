import React, { useCallback, useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Input } from '../components';
import { SearchResult, Track, YouTubePlaylistSearchResult } from '../types/music';
import { RootStackParamList } from '../types/navigation';
import { useMusicPlayer } from '../context/MusicPlayerContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;

type SearchMode = 'videos' | 'playlists';

const extractPlaylistId = (value: string): string | null => {
  const listMatch = value.match(/[?&]list=([^&]+)/i);
  if (listMatch?.[1]) return decodeURIComponent(listMatch[1]);

  const trimmed = value.trim();
  if (/^(PL|UU|LL|OLAK5uy_)[A-Za-z0-9_-]+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
};

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('videos');
  const [videoResults, setVideoResults] = useState<SearchResult[]>([]);
  const [playlistResults, setPlaylistResults] = useState<
    YouTubePlaylistSearchResult[]
  >([]);
  const [loading, setLoading] = useState(false);

  const {
    playTrack,
    addToQueue,
    playlists,
    addTrackToPlaylist,
    playQueue,
    searchMusic,
    searchYouTubePlaylists,
    getYouTubePlaylist,
    getTrendingMusic,
  } = useMusicPlayer();

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  };

  const loadTrending = useCallback(async () => {
    setLoading(true);
    try {
      const trending = await getTrendingMusic();
      setVideoResults(trending);
    } catch (error) {
      console.error('Load trending error:', error);
    } finally {
      setLoading(false);
    }
  }, [getTrendingMusic]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    if (mode === 'playlists') {
      const playlistId = extractPlaylistId(query);
      if (playlistId) {
        navigation.navigate('YouTubePlaylist', { playlistId });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'videos') {
        const searchResults = await searchMusic(query);
        setVideoResults(searchResults);
      } else {
        const results = await searchYouTubePlaylists(query);
        setPlaylistResults(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search. Please try again.');
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

    Alert.alert('Add to Playlist', 'Select a playlist', buttons);
  };

  const openVideoOptions = (item: SearchResult) => {
    Alert.alert(item.title, 'Choose action', [
      { text: 'Play Now', onPress: () => handlePlayTrack(item) },
      { text: 'Add to Queue', onPress: () => handleAddToQueue(item) },
      { text: 'Add to Playlist', onPress: () => handleAddToPlaylist(item) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleOpenPlaylist = (item: YouTubePlaylistSearchResult) => {
    navigation.navigate('YouTubePlaylist', {
      playlistId: item.playlistId,
      title: item.title,
    });
  };

  const handlePlayYouTubePlaylist = async (playlistId: string) => {
    setLoading(true);
    try {
      const data = await getYouTubePlaylist(playlistId);
      if (!data || data.tracks.length === 0) {
        Alert.alert('Empty playlist', 'No tracks found in this playlist.');
        return;
      }
      await playQueue(data.tracks, 0, null);
      navigation.navigate('NowPlaying');
    } catch (e) {
      console.error('Play playlist error:', e);
      Alert.alert('Error', 'Failed to play playlist.');
    } finally {
      setLoading(false);
    }
  };

  const openPlaylistOptions = (item: YouTubePlaylistSearchResult) => {
    Alert.alert(item.title, 'Choose action', [
      { text: 'Open', onPress: () => handleOpenPlaylist(item) },
      { text: 'Play', onPress: () => handlePlayYouTubePlaylist(item.playlistId) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };



  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  useEffect(() => {
    if (mode === 'videos' && query.trim().length === 0) {
      loadTrending();
    }
  }, [mode, query, loadTrending]);

  const renderVideoItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handlePlayTrack(item)}
      activeOpacity={0.8}
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
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          openVideoOptions(item);
        }}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({ item }: { item: YouTubePlaylistSearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleOpenPlaylist(item)}
      activeOpacity={0.8}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Ionicons name="list" size={24} color="#666666" />
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.resultArtist} numberOfLines={1}>
          {item.author}
        </Text>
        {typeof item.videoCount === 'number' && (
          <Text style={styles.resultDuration}>{item.videoCount} videos</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          openPlaylistOptions(item);
        }}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder={mode === 'videos' ? 'Search for music...' : 'Search for playlists or paste a playlist URL...'}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.modeButtonLeft,
            mode === 'videos' && styles.modeButtonActive,
          ]}
          onPress={() => setMode('videos')}
        >
          <Text style={[styles.modeText, mode === 'videos' && styles.modeTextActive]}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'playlists' && styles.modeButtonActive]}
          onPress={() => setMode('playlists')}
        >
          <Text
            style={[styles.modeText, mode === 'playlists' && styles.modeTextActive]}
          >
            Playlists
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : mode === 'videos' ? (
        <FlatList
          data={videoResults}
          renderItem={renderVideoItem}
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
      ) : (
        <FlatList
          data={playlistResults}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.playlistId}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {query ? 'No results found' : 'Search for YouTube playlists'}
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
  },
  modeButtonLeft: {
    marginRight: 8,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    color: '#AAAAAA',
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#FFFFFF',
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
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#1A1A1A',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
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
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
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
