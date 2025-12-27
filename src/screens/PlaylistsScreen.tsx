import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Button, Input, Card } from '../components';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Playlist } from '../types/music';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function PlaylistsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playlists, createPlaylist, deletePlaylist, playPlaylist } =
    useMusicPlayer();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      Alert.alert('Error', 'Please enter a playlist name');
      return;
    }

    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setShowCreateForm(false);
    Alert.alert('Success', 'Playlist created successfully');
  };

  const handleDeletePlaylist = (playlistId: string, playlistName: string) => {
    Alert.alert(
      'Delete Playlist',
      `Are you sure you want to delete "${playlistName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlaylist(playlistId),
        },
      ]
    );
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length === 0) {
      Alert.alert('Empty Playlist', 'This playlist has no tracks');
      return;
    }
    playPlaylist(playlist);
    Alert.alert('Playing', `Now playing: ${playlist.name}`);
  };

  const openPlaylistMenu = (playlist: Playlist) => {
    Alert.alert(playlist.name, 'Choose action', [
      { text: 'Play', onPress: () => handlePlayPlaylist(playlist) },
      {
        text: 'View Details',
        onPress: () =>
          navigation.navigate('PlaylistDetails', { playlistId: playlist.id }),
      },
      {
        text: 'Delete',
        onPress: () => handleDeletePlaylist(playlist.id, playlist.name),
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <Card>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PlaylistDetails', { playlistId: item.id })
        }
        activeOpacity={0.85}
      >
        <View style={styles.playlistItem}>
          <View style={styles.playlistIcon}>
            <Ionicons name="musical-notes" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.playlistInfo}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text style={styles.playlistCount}>
              {item.tracks.length}{' '}
              {item.tracks.length === 1 ? 'track' : 'tracks'}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handlePlayPlaylist(item);
              }}
              style={styles.playButton}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                openPlaylistMenu(item);
              }}
              style={styles.menuButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="+ Create Playlist"
          onPress={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
        />
      </View>

      {showCreateForm && (
        <Card style={styles.createForm}>
          <Input
            label="Playlist Name"
            placeholder="Enter playlist name"
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <View style={styles.formButtons}>
            <Button
              title="Create"
              onPress={handleCreatePlaylist}
              style={styles.formButton}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setShowCreateForm(false);
                setNewPlaylistName('');
              }}
              variant="secondary"
              style={styles.formButton}
            />
          </View>
        </Card>
      )}

      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No playlists yet</Text>
            <Text style={styles.emptySubtext}>
              Create a playlist to organize your music
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
  },
  createForm: {
    margin: 16,
    backgroundColor: '#1A1A1A',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  listContent: {
    paddingBottom: 150,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistCount: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
  },
});
