# Music Player Guide

## Overview

This app includes a fully-featured music player with YouTube integration, allowing you to search, stream, and organize music with native Android support.

## Features

### 🎵 Music Playback
- Stream audio from YouTube videos
- Native audio playback with expo-av
- Background audio support
- Play/Pause/Stop controls
- Seek functionality
- Volume control

### 🔍 Search
- Search YouTube for music
- Browse trending music
- View video thumbnails and metadata
- Instant playback

### 📋 Playlists
- Create custom playlists
- Add tracks to playlists
- Remove tracks from playlists
- Play entire playlists
- Persistent storage (saved locally)

### 🎚️ Queue Management
- Add songs to queue
- View current queue
- Skip to next/previous track
- Clear queue

### 🔁 Playback Controls
- **Repeat Modes**: Off, One, All
- **Shuffle**: Randomize playback order
- **Mini Player**: Always visible player bar
- **Now Playing**: Full-screen player view

## How to Use

### Searching for Music

1. Navigate to the **Search** tab
2. Enter a song name, artist, or keyword
3. Tap **Search** or press Enter
4. Tap any result to play immediately
5. Long-press for more options:
   - Play Now
   - Add to Queue
   - Add to Playlist

### Creating Playlists

1. Go to the **Playlists** tab
2. Tap **+ Create Playlist**
3. Enter a name and tap **Create**
4. Add tracks by searching and selecting "Add to Playlist"

### Playing Music

1. **From Search**: Tap any search result
2. **From Playlist**: Open playlist and tap a track or "Play All"
3. **Mini Player**: Appears at bottom when music is playing
4. **Now Playing**: Tap mini player for full controls

### Using the Mini Player

The mini player appears at the bottom of all screens when music is playing:
- Shows current track info and artwork
- **Play/Pause button**: Control playback
- **Next button**: Skip to next track
- **Tap anywhere**: Open Now Playing screen

### Now Playing Screen

Full-screen music player with:
- Large album artwork
- Track title and artist
- Progress slider
- Playback controls
- Repeat and shuffle buttons
- Time remaining

## Technical Details

### Audio Streaming

The app uses **Invidious API** to fetch YouTube audio streams:
- No YouTube API key required
- Direct audio URL extraction
- Adaptive bitrate selection
- Best quality audio preferred

### Services

#### YouTubeService
- Search functionality
- Video metadata retrieval
- Audio URL extraction
- Trending music discovery

#### AudioPlayerService
- expo-av Sound API
- Playback state management
- Position tracking
- Audio mode configuration

### State Management

Uses React Context API for global state:
- Current track
- Playback status
- Queue management
- Playlist storage

### Data Persistence

- Playlists saved with AsyncStorage
- Survives app restarts
- Automatic synchronization

## Permissions

### Android
- **INTERNET**: Stream audio
- **ACCESS_NETWORK_STATE**: Check connectivity
- **FOREGROUND_SERVICE**: Background playback
- **WAKE_LOCK**: Prevent sleep during playback

### iOS
- Audio plays in silent mode
- Background audio capability
- Lock screen controls

## Architecture

```
src/
├── components/
│   └── MiniPlayer.tsx          # Bottom player bar
├── context/
│   └── MusicPlayerContext.tsx  # Global player state
├── screens/
│   ├── MusicPlayerScreen.tsx   # Main music tab
│   ├── SearchScreen.tsx        # Search interface
│   ├── PlaylistsScreen.tsx     # Playlist list
│   ├── PlaylistDetailsScreen.tsx # Playlist tracks
│   └── NowPlayingScreen.tsx    # Full player
├── services/
│   ├── YouTubeService.ts       # YouTube API
│   └── AudioPlayerService.ts   # Audio playback
└── types/
    └── music.ts                # Type definitions
```

## Tips & Tricks

### Better Search Results
- Use specific song names and artists
- Add keywords like "official audio" or "music"
- Try different search terms if results aren't good

### Managing Playlists
- Long-press playlists for quick actions
- Organize songs in the order you want
- Create themed playlists (workout, chill, etc.)

### Queue Management
- Add multiple songs before playing
- Queue persists until cleared
- Use shuffle for variety

### Playback Tips
- Use repeat mode for favorite songs
- Shuffle playlists for discovery
- Background playback works even when app is minimized

## Troubleshooting

### No Audio Playing
1. Check internet connection
2. Try a different search result
3. Restart the app
4. Check device volume

### Search Not Working
1. Verify internet connection
2. Try different search terms
3. Check if Invidious API is accessible

### Playback Issues
1. Clear queue and try again
2. Check audio permissions
3. Restart the app
4. Ensure device has sufficient storage

### Can't Create Playlist
1. Ensure storage permissions
2. Try a different name
3. Restart the app

## Known Limitations

- No offline playback (streaming only)
- Depends on Invidious API availability
- Audio-only (no video playback)
- Limited to YouTube content

## Future Enhancements

Potential features for future versions:
- [ ] Download for offline playback
- [ ] Lyrics display
- [ ] Audio equalizer
- [ ] Sleep timer
- [ ] Sharing playlists
- [ ] Import/Export playlists
- [ ] Recently played history
- [ ] Favorites/Liked songs
- [ ] Audio visualization
- [ ] Cross-fade between tracks

## API Information

### Invidious
- Open-source YouTube frontend
- No API key required
- Public instances available
- Rate limiting may apply

**Default Instance**: `https://invidious.io.lol`

Alternative instances can be configured in `YouTubeService.ts`

## Development

### Adding New Features

1. **New Screen**: Add to `src/screens/`
2. **Update Navigation**: Modify `AppNavigator.tsx`
3. **Add Types**: Update `src/types/music.ts`
4. **Context Methods**: Add to `MusicPlayerContext.tsx`

### Testing

```bash
npm run android  # Test on Android
npm run ios      # Test on iOS (macOS only)
npm start        # Start dev server
```

### Building

```bash
eas build --platform android  # Build APK/AAB
expo prebuild                 # Generate native folders
```

## Credits

- **expo-av**: Audio playback
- **Invidious**: YouTube API alternative
- **React Navigation**: Navigation
- **AsyncStorage**: Data persistence

## License

Same as main project (MIT License)
