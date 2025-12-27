export interface LyricsLine {
  time: number;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail?: string;
  url?: string;
  videoId?: string;
  lyrics?: LyricsLine[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  thumbnail?: string;
  createdAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  repeatMode: 'off' | 'one' | 'all';
  shuffleMode: boolean;
}

export interface SearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: string;
  viewCount?: string;
}
