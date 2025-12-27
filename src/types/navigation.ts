import { Track } from './music';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string; title: string };
  Profile: undefined;
  MusicPlayer: undefined;
  Search: undefined;
  Playlists: undefined;
  PlaylistDetails: { playlistId: string };
  YouTubePlaylist: { playlistId: string; title?: string };
  NowPlaying: undefined;
  Lyrics: { track?: Track } | undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  MusicPlayer: undefined;
  Search: undefined;
  Playlists: undefined;
  Settings: undefined;
};
