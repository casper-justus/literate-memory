# React Native Expo Music Player App

A comprehensive cross-platform mobile application with integrated YouTube music player, built with React Native and Expo for Android native support.

## 🎵 Key Features

### Music Player
- **YouTube Integration**: Stream music directly from YouTube
- **Search**: Find any song, artist, or album
- **Playlists**: Create and manage custom playlists
- **Queue Management**: Add, remove, and reorder tracks
- **Playback Controls**: Play, pause, skip, seek, repeat, shuffle
- **Now Playing**: Beautiful full-screen player interface
- **Mini Player**: Always-accessible player bar
- **Background Playback**: Music continues when app is minimized

### App Features
- ✅ TypeScript support
- ✅ React Navigation (Stack & Bottom Tabs)
- ✅ Custom reusable components
- ✅ Custom hooks (useStorage, useFetch)
- ✅ Utility functions (formatters, validators)
- ✅ AsyncStorage for data persistence
- ✅ Android native build support
- ✅ Modern UI with dark theme

## 📱 Screenshots

### Main Tabs
- **Home**: Dashboard with quick access
- **Music**: Music player overview
- **Search**: YouTube music search
- **Playlists**: Manage your playlists
- **Profile**: User settings

### Music Features
- **Search Screen**: Browse and search YouTube music
- **Now Playing**: Full-screen player with controls
- **Playlist Management**: Organize your music
- **Queue View**: See what's playing next

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Android Studio (for Android development)
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-native-expo-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Web
```bash
npm run web
```

## 🎼 Using the Music Player

### Search for Music
1. Open the **Search** tab
2. Enter song name, artist, or keywords
3. Tap any result to play immediately
4. Long-press for options (queue, playlist)

### Create Playlists
1. Go to **Playlists** tab
2. Tap **+ Create Playlist**
3. Give it a name
4. Add songs from search results

### Control Playback
- **Mini Player**: Shows at bottom of screen when playing
- **Now Playing**: Tap mini player for full controls
- **Repeat**: Cycle through off/one/all
- **Shuffle**: Randomize playback order

## 🛠️ Tech Stack

**Core**
- React Native 0.81.5
- Expo SDK ~54.0
- TypeScript ~5.9

**Audio**
- expo-av (audio playback)
- Invidious API (YouTube integration)

**Navigation**
- React Navigation v7
- Stack & Tab navigators

**Storage**
- AsyncStorage (playlists, settings)

**HTTP**
- Axios (API requests)

**UI Components**
- Custom components library
- @react-native-community/slider

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── LoadingSpinner.tsx
│   └── MiniPlayer.tsx   # Bottom player bar
├── context/             # React Context
│   └── MusicPlayerContext.tsx  # Global music state
├── hooks/               # Custom hooks
│   ├── useFetch.ts
│   └── useStorage.ts
├── navigation/          # Navigation setup
│   └── AppNavigator.tsx
├── screens/             # Screen components
│   ├── HomeScreen.tsx
│   ├── MusicPlayerScreen.tsx
│   ├── SearchScreen.tsx
│   ├── PlaylistsScreen.tsx
│   ├── PlaylistDetailsScreen.tsx
│   ├── NowPlayingScreen.tsx
│   ├── DetailsScreen.tsx
│   └── ProfileScreen.tsx
├── services/            # Business logic
│   ├── YouTubeService.ts
│   └── AudioPlayerService.ts
├── types/               # TypeScript types
│   ├── music.ts
│   └── navigation.ts
└── utils/               # Helper functions
    ├── formatters.ts
    └── validators.ts
```

## 🔧 Configuration

### Android Permissions
The app requires these permissions (configured in `app.json`):
- `INTERNET` - Stream audio
- `ACCESS_NETWORK_STATE` - Check connectivity
- `FOREGROUND_SERVICE` - Background playback
- `WAKE_LOCK` - Keep playing when screen off

### API Configuration
The app uses **Invidious** (open-source YouTube frontend):
- No API key required
- Public instance: `https://invidious.io.lol`
- Can be changed in `src/services/YouTubeService.ts`

## 📖 Documentation

- [Music Player Guide](./MUSIC_PLAYER_GUIDE.md) - Detailed music features
- [Android Build Guide](./ANDROID_BUILD.md) - Building for Android
- [Quick Start](./QUICKSTART.md) - Get started quickly
- [Contributing](./CONTRIBUTING.md) - How to contribute

## 🏗️ Building for Production

### Android APK
```bash
eas build --platform android --profile preview
```

### Android AAB (Play Store)
```bash
eas build --platform android --profile production
```

### Generate Native Folders
```bash
expo prebuild
```

## 🧪 Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🐛 Troubleshooting

### Audio Not Playing
- Check internet connection
- Verify device volume
- Try different search result
- Restart the app

### Search Issues
- Verify internet connectivity
- Check if Invidious API is accessible
- Try different search terms

### Build Errors
```bash
# Clear cache and rebuild
expo start --clear
npm run android
```

## 🎯 Features Roadmap

- [ ] Download music for offline playback
- [ ] Lyrics display
- [ ] Audio equalizer
- [ ] Sleep timer
- [ ] Share playlists
- [ ] Import/export playlists
- [ ] Recently played history
- [ ] Favorites system
- [ ] Audio visualization
- [ ] Cross-fade transitions

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

## 🙏 Credits

- **Expo** - Development framework
- **React Navigation** - Navigation library
- **Invidious** - YouTube API alternative
- **expo-av** - Audio playback

## 👥 Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) first.

## 📞 Support

For issues and questions:
1. Check the [Music Player Guide](./MUSIC_PLAYER_GUIDE.md)
2. Review [Troubleshooting](#-troubleshooting) section
3. Open an issue on GitHub

---

**Note**: This app streams audio from YouTube. Ensure you comply with YouTube's Terms of Service in your region.
