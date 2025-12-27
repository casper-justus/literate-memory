import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Track } from '../types/music';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { fetchLyrics, LyricsResult } from '../services/LyricsService';

type LyricsRouteProp = RouteProp<RootStackParamList, 'Lyrics'>;

export default function LyricsScreen() {
  const route = useRoute<LyricsRouteProp>();
  const { playerState, backendService } = useMusicPlayer();

  const track: Track | null = useMemo(() => {
    return route.params?.track || playerState.currentTrack || null;
  }, [route.params, playerState.currentTrack]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LyricsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!track) return;
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const lyrics = backendService
          ? await backendService.getLyrics(track.artist, track.title)
          : await fetchLyrics(track.artist, track.title);

        if (!lyrics) {
          setError('No lyrics found for this track.');
          return;
        }

        setResult({
          lyrics: lyrics.lyrics,
          syncedLyrics: lyrics.syncedLyrics,
          source: lyrics.source,
        });
      } catch (e) {
        console.error('Lyrics fetch error:', e);
        setError('Failed to load lyrics.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [backendService, track]);

  if (!track) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lyrics</Text>
        <Text style={styles.subtitle}>No track playing</Text>
      </View>
    );
  }

  const backgroundSource = track.thumbnail
    ? { uri: track.thumbnail }
    : undefined;

  const content = (
    <View style={styles.content}>
      <Text style={styles.title} numberOfLines={2}>
        {track.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {track.artist}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading lyrics...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.sourceText}>Source: {result?.source}</Text>
          <ScrollView contentContainerStyle={styles.lyricsContainer}>
            <Text style={styles.lyricsText}>{result?.lyrics}</Text>
          </ScrollView>
        </>
      )}
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
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sourceText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#AAAAAA',
  },
  errorText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
  lyricsContainer: {
    paddingBottom: 40,
  },
  lyricsText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});
