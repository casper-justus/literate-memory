import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Card } from '../components';
import { useMusicPlayer } from '../context/MusicPlayerContext';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function MusicPlayerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { playerState, playlists } = useMusicPlayer();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Search')}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="search" size={32} color="#007AFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Search Music</Text>
            <Text style={styles.menuSubtitle}>Find and play your favorite tracks</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Playlists')}
        >
          <View style={styles.menuIconContainer}>
            <Ionicons name="list" size={32} color="#007AFF" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>My Playlists</Text>
            <Text style={styles.menuSubtitle}>{playlists.length} playlists</Text>
          </View>
        </TouchableOpacity>

        {playerState.currentTrack && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('NowPlaying')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="headset" size={32} color="#007AFF" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Now Playing</Text>
              <Text style={styles.menuSubtitle}>{playerState.currentTrack.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Queue</Text>
        {playerState.queue.length > 0 ? (
          <View>
            <Text style={styles.queueText}>
              {playerState.queue.length} {playerState.queue.length === 1 ? 'track' : 'tracks'} in queue
            </Text>
            {playerState.queue.slice(0, 3).map((track, index) => (
              <View key={track.id} style={styles.queueItem}>
                <Text style={styles.queueNumber}>{index + 1}</Text>
                <Text style={styles.queueTrack} numberOfLines={1}>
                  {track.title}
                </Text>
              </View>
            ))}
            {playerState.queue.length > 3 && (
              <Text style={styles.queueMore}>
                +{playerState.queue.length - 3} more
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyText}>No tracks in queue</Text>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.feature}>
            <Ionicons name="logo-youtube" size={32} color="#FFFFFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>YouTube Music</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="phone-portrait" size={32} color="#FFFFFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Native Playback</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="repeat" size={32} color="#FFFFFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Repeat & Shuffle</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="list" size={32} color="#FFFFFF" style={styles.featureIcon} />
            <Text style={styles.featureText}>Playlists</Text>
          </View>
        </View>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Music Player with YouTube Integration</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingBottom: 160,
  },
  card: {
    margin: 16,
    backgroundColor: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  menuIconContainer: {
    width: 48,
    alignItems: 'center',
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  queueText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  queueNumber: {
    width: 24,
    fontSize: 14,
    color: '#666666',
  },
  queueTrack: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
  },
  queueMore: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  feature: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
