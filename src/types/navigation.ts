import { Track, Playlist } from './music';

export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: string; title: string };
  Profile: undefined;
  MusicPlayer: undefined;
  Search: undefined;
  Playlists: undefined;
  PlaylistDetails: { playlistId: string };
  NowPlaying: undefined;
  Settings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  MusicPlayer: undefined;
  Search: undefined;
  Playlists: undefined;
  Settings: undefined;
};
