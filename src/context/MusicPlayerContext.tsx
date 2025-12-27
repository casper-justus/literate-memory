import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AVPlaybackStatus } from 'expo-av';
import {
  Track,
  PlayerState,
  Playlist,
  SearchResult,
  YouTubePlaylist,
  YouTubePlaylistSearchResult,
} from '../types/music';
import AudioPlayerService from '../services/AudioPlayerService';
import YouTubeService from '../services/YouTubeService';
import BackendMusicService, { BackendMusicService as BackendMusicServiceClass } from '../services/BackendMusicService';
import { useStorage } from '../hooks/useStorage';

interface MusicPlayerContextType {
  playerState: PlayerState;
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  backendService: BackendMusicServiceClass | null;
  settings: AppSettings;
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setRepeatMode: (mode: 'off' | 'one' | 'all') => void;
  toggleShuffle: () => void;
  createPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  playPlaylist: (playlist: Playlist) => Promise<void>;
  playQueue: (tracks: Track[], startIndex?: number, playlist?: Playlist | null) => Promise<void>;
  searchMusic: (query: string) => Promise<SearchResult[]>;
  searchYouTubePlaylists: (query: string) => Promise<YouTubePlaylistSearchResult[]>;
  getYouTubePlaylist: (playlistId: string) => Promise<YouTubePlaylist | null>;
  getTrendingMusic: () => Promise<SearchResult[]>;
  getAudioUrl: (videoId: string) => Promise<string | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

interface AppSettings {
  useBackendApi: boolean;
  backendUrl: string;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    queue: [],
    currentIndex: -1,
    repeatMode: 'off',
    shuffleMode: false,
  });

  const { storedValue: playlists, setValue: setPlaylists } = useStorage<Playlist[]>('playlists', []);
  const { storedValue: settings } = useStorage<AppSettings>('appSettings', {
    useBackendApi: false,
    backendUrl: 'http://localhost:3000/api/music',
  });
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [backendService, setBackendService] = useState<BackendMusicServiceClass | null>(null);

  useEffect(() => {
    if (settings.useBackendApi) {
      setBackendService(new BackendMusicServiceClass(settings.backendUrl));
    } else {
      setBackendService(null);
    }
  }, [settings?.useBackendApi, settings?.backendUrl]);

  useEffect(() => {
    AudioPlayerService.initialize();

    AudioPlayerService.setStatusUpdateCallback((status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setPlayerState((prev) => ({
          ...prev,
          position: status.positionMillis,
          duration: status.durationMillis || 0,
          isPlaying: status.isPlaying,
        }));
      }
    });

    AudioPlayerService.setTrackEndCallback(() => {
      nextTrack();
    });

    return () => {
      AudioPlayerService.cleanup();
    };
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    try {
      let audioUrl: string | undefined = track.url;
      
      if (!audioUrl && track.videoId) {
        if (backendService) {
          audioUrl = await backendService.getAudioUrl(track.videoId) || undefined;
        } else {
          const fetchedUrl = await YouTubeService.getAudioUrl(track.videoId);
          audioUrl = fetchedUrl || undefined;
        }
      }

      if (!audioUrl) {
        console.error('Unable to get audio URL');
        return;
      }

      const trackWithUrl = { ...track, url: audioUrl };
      const success = await AudioPlayerService.loadTrack(trackWithUrl, true);

      if (success) {
        setPlayerState((prev) => ({
          ...prev,
          currentTrack: trackWithUrl,
          isPlaying: true,
        }));
      }
    } catch (error) {
      console.error('Play track error:', error);
    }
  }, [backendService]);

  const pauseTrack = useCallback(async () => {
    await AudioPlayerService.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeTrack = useCallback(async () => {
    await AudioPlayerService.play();
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const stopTrack = useCallback(async () => {
    await AudioPlayerService.stop();
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
      position: 0,
    }));
  }, []);

  const nextTrack = useCallback(async () => {
    const { queue, currentIndex, repeatMode } = playerState;

    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }

    setPlayerState((prev) => ({ ...prev, currentIndex: nextIndex }));
    await playTrack(queue[nextIndex]);
  }, [playerState, playTrack]);

  const previousTrack = useCallback(async () => {
    const { queue, currentIndex, position } = playerState;

    if (queue.length === 0) return;

    if (position > 3000) {
      await seekTo(0);
      return;
    }

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setPlayerState((prev) => ({ ...prev, currentIndex: prevIndex }));
    await playTrack(queue[prevIndex]);
  }, [playerState, playTrack]);

  const seekTo = useCallback(async (position: number) => {
    await AudioPlayerService.seekTo(position);
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index),
    }));
  }, []);

  const clearQueue = useCallback(() => {
    setPlayerState((prev) => ({
      ...prev,
      queue: [],
      currentIndex: -1,
    }));
  }, []);

  const setRepeatMode = useCallback((mode: 'off' | 'one' | 'all') => {
    setPlayerState((prev) => ({ ...prev, repeatMode: mode }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, shuffleMode: !prev.shuffleMode }));
  }, []);

  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
    };
    setPlaylists([...playlists, newPlaylist]);
  }, [playlists, setPlaylists]);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: [...playlist.tracks, track],
        };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
  }, [playlists, setPlaylists]);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    const updatedPlaylists = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          tracks: playlist.tracks.filter((t) => t.id !== trackId),
        };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
  }, [playlists, setPlaylists]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(playlists.filter((p) => p.id !== playlistId));
  }, [playlists, setPlaylists]);

  const playPlaylist = useCallback(async (playlist: Playlist) => {
    if (playlist.tracks.length === 0) return;

    setCurrentPlaylist(playlist);
    setPlayerState((prev) => ({
      ...prev,
      queue: playlist.tracks,
      currentIndex: 0,
    }));
    await playTrack(playlist.tracks[0]);
  }, [playTrack]);

  const playQueue = useCallback(
    async (tracks: Track[], startIndex: number = 0, playlist: Playlist | null = null) => {
      if (tracks.length === 0) return;
      if (startIndex < 0 || startIndex >= tracks.length) return;

      setCurrentPlaylist(playlist);
      setPlayerState((prev) => ({
        ...prev,
        queue: tracks,
        currentIndex: startIndex,
      }));
      await playTrack(tracks[startIndex]);
    },
    [playTrack]
  );

  const searchYouTubePlaylists = useCallback(
    async (query: string): Promise<YouTubePlaylistSearchResult[]> => {
      if (!query.trim()) return [];
      return await YouTubeService.searchPlaylists(query);
    },
    []
  );

  const getYouTubePlaylist = useCallback(
    async (playlistId: string): Promise<YouTubePlaylist | null> => {
      if (!playlistId.trim()) return null;

      if (backendService) {
        return await backendService.getPlaylist(playlistId);
      }

      return await YouTubeService.getPlaylist(playlistId);
    },
    [backendService]
  );

  const searchMusic = useCallback(async (query: string): Promise<SearchResult[]> => {
    try {
      if (backendService) {
        return await backendService.search(query);
      } else {
        return await YouTubeService.search(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [backendService]);

  const getTrendingMusic = useCallback(async (): Promise<SearchResult[]> => {
    try {
      if (backendService) {
        return await backendService.getTrending();
      } else {
        return await YouTubeService.getTrendingMusic();
      }
    } catch (error) {
      console.error('Get trending error:', error);
      return [];
    }
  }, [backendService]);

  const getAudioUrl = useCallback(async (videoId: string): Promise<string | null> => {
    try {
      if (backendService) {
        return await backendService.getAudioUrl(videoId);
      } else {
        return await YouTubeService.getAudioUrl(videoId);
      }
    } catch (error) {
      console.error('Get audio URL error:', error);
      return null;
    }
  }, [backendService]);

  return (
    <MusicPlayerContext.Provider
      value={{
        playerState,
        playlists,
        currentPlaylist,
        backendService,
        settings,
        playTrack,
        pauseTrack,
        resumeTrack,
        stopTrack,
        nextTrack,
        previousTrack,
        seekTo,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setRepeatMode,
        toggleShuffle,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        deletePlaylist,
        playPlaylist,
        playQueue,
        searchMusic,
        searchYouTubePlaylists,
        getYouTubePlaylist,
        getTrendingMusic,
        getAudioUrl,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}
