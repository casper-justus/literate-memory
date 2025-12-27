# Music Player with yt-dlp Backend - Complete Guide

A comprehensive React Native Expo music player app with integrated yt-dlp backend for high-quality YouTube music streaming.

## 🎯 Project Overview

This is a full-stack music player application consisting of:
- **Frontend**: React Native Expo mobile app with beautiful GUI
- **Backend**: Node.js API server with yt-dlp integration
- **Features**: Search, playlists, queue management, high-quality audio streaming

## 🏗️ Architecture

```
┌────────────────────────────────────────┐
│     React Native Mobile App (Frontend) │
│  ┌──────────────────────────────────┐  │
│  │  - Music Player UI               │  │
│  │  - Search Interface              │  │
│  │  - Playlist Management           │  │
│  │  - Queue System                  │  │
│  │  - Settings (Backend Toggle)     │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  │ HTTP REST API
┌─────────────────▼──────────────────────┐
│   Node.js Backend API Server           │
│  ┌──────────────────────────────────┐  │
│  │  - Express REST API              │  │
│  │  - Search Endpoint               │  │
│  │  - Audio URL Extraction          │  │
│  │  - Trending Music                │  │
│  └──────────────┬───────────────────┘  │
└─────────────────┼──────────────────────┘
                  │ Shell Commands
┌─────────────────▼──────────────────────┐
│   yt-dlp (YouTube Downloader)          │
│  - Direct Audio Stream URLs            │
│  - High Quality Audio                  │
│  - Video Metadata Extraction           │
└────────────────────────────────────────┘
```

## ✨ Features

### Music Playback
- ✅ Stream music from YouTube
- ✅ High-quality audio (via yt-dlp backend)
- ✅ Play/Pause/Stop/Skip controls
- ✅ Seek functionality
- ✅ Volume control
- ✅ Background playback
- ✅ Repeat modes (off, one, all)
- ✅ Shuffle mode

### User Interface
- ✅ Dark theme design
- ✅ Tab navigation (5 tabs)
- ✅ Mini player bar (always visible)
- ✅ Full Now Playing screen
- ✅ Beautiful artwork display
- ✅ Progress slider
- ✅ Loading states
- ✅ Error handling

### Search & Discovery
- ✅ YouTube music search
- ✅ Trending music
- ✅ Search results with thumbnails
- ✅ Duration and view count display
- ✅ Fast search with backend
- ✅ Fallback to Invidious API

### Playlist Management
- ✅ Create custom playlists
- ✅ Add tracks to playlists
- ✅ Remove tracks from playlists
- ✅ Play entire playlists
- ✅ Delete playlists
- ✅ Persistent storage (AsyncStorage)

### Queue Management
- ✅ Add songs to queue
- ✅ View current queue
- ✅ Skip to next/previous
- ✅ Auto-advance tracks
- ✅ Clear queue

### Backend Integration
- ✅ Optional yt-dlp backend
- ✅ Toggle between Invidious and yt-dlp
- ✅ Backend health monitoring
- ✅ Connection status display
- ✅ Settings configuration

## 📦 Project Structure

```
react-native-expo-app/
├── backend/                    # Node.js backend server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   └── musicController.js
│   │   ├── services/           # Business logic
│   │   │   └── ytdlpService.js
│   │   ├── routes/             # API routes
│   │   │   └── musicRoutes.js
│   │   └── index.js            # Main server
│   ├── Dockerfile              # Docker configuration
│   ├── package.json
│   └── README.md
├── src/                        # Frontend React Native app
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── MiniPlayer.tsx
│   ├── context/                # React Context
│   │   └── MusicPlayerContext.tsx
│   ├── hooks/                  # Custom hooks
│   │   ├── useFetch.ts
│   │   └── useStorage.ts
│   ├── navigation/             # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/                # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── MusicPlayerScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── PlaylistsScreen.tsx
│   │   ├── PlaylistDetailsScreen.tsx
│   │   ├── NowPlayingScreen.tsx
│   │   ├── DetailsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/               # Business logic
│   │   ├── YouTubeService.ts   # Invidious API
│   │   ├── AudioPlayerService.ts
│   │   └── BackendMusicService.ts  # yt-dlp backend
│   ├── types/                  # TypeScript types
│   │   ├── music.ts
│   │   └── navigation.ts
│   └── utils/                  # Helper functions
│       ├── formatters.ts
│       └── validators.ts
├── docker-compose.yml          # Docker Compose config
├── SETUP_GUIDE.md             # Comprehensive setup guide
├── MUSIC_PLAYER_GUIDE.md      # User guide
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Python 3.7+
- Android Studio (for Android development)
- Expo CLI

### 1. Install yt-dlp

```bash
pip3 install -U yt-dlp
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend runs on `http://localhost:3000`

### 3. Setup Frontend

```bash
# From project root
npm install
npm start
# Then press 'a' for Android or 'i' for iOS
```

### 4. Configure in App

1. Open app
2. Go to **Settings** tab (⚙️)
3. Enable "Use Backend API (yt-dlp)"
4. Verify status shows "Online" ✅

## 📱 Usage

### Basic Workflow
1. **Search** for music (Search tab 🔍)
2. **Tap** to play immediately
3. **Long-press** for options (queue, playlist)
4. Use **Mini Player** for quick controls
5. Tap Mini Player for **full player**
6. Manage **playlists** in Playlists tab
7. Configure **settings** in Settings tab

### Features by Tab

#### 🏠 Home
- Quick access dashboard
- Queue overview
- Recently played

#### 🎵 Music
- Main music hub
- Quick access to features
- Statistics

#### 🔍 Search
- Search YouTube music
- Trending on load
- Add to queue/playlist

#### 📋 Playlists
- View all playlists
- Create new playlists
- Play playlists

#### ⚙️ Settings
- Toggle backend API
- Configure backend URL
- Audio quality settings
- Auto-play toggle
- Notifications

## 🔧 Backend API Endpoints

```
GET /api/music/search?query=<query>&limit=<number>
GET /api/music/trending?region=<region>
GET /api/music/video/:videoId
GET /api/music/audio/:videoId
GET /api/music/formats/:videoId
GET /api/music/stream/:videoId
GET /api/music/health
```

## 🐳 Docker Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Or build manually
cd backend
docker build -t music-player-backend .
docker run -p 3000:3000 music-player-backend
```

## 🎨 GUI Features

### Dark Theme
- Black background (#000000)
- Dark cards (#1A1A1A)
- Blue accents (#007AFF)
- Professional look

### Components
- **MiniPlayer**: Sticky bottom player bar
- **Now Playing**: Full-screen modal player
- **Cards**: Elevated content containers
- **Buttons**: Multiple variants (primary, secondary, danger)
- **Inputs**: Form inputs with validation
- **Sliders**: Audio progress control

### Navigation
- **Bottom Tabs**: 5 main tabs with emoji icons
- **Stack Navigation**: For detail screens
- **Modal Presentation**: For Now Playing
- **Gestures**: Swipe back, long-press menus

## 📊 Performance

### Optimizations
- Lazy loading of audio
- Memoized callbacks
- FlatList for large lists
- Image caching
- Efficient re-renders

### Backend Benefits
- Direct YouTube streams
- No intermediary servers
- Better audio quality
- More reliable
- Faster responses

## 🔐 Security

### Backend
- Input validation
- Error handling
- No exposed secrets
- CORS configuration
- Rate limiting ready

### Frontend
- Secure storage (AsyncStorage)
- No hardcoded credentials
- Environment variables
- Safe API calls

## 📝 Documentation

- `SETUP_GUIDE.md` - Complete setup instructions
- `MUSIC_PLAYER_GUIDE.md` - User guide for music features
- `MUSIC_PLAYER_IMPLEMENTATION.md` - Technical implementation
- `backend/README.md` - Backend API documentation
- `ANDROID_BUILD.md` - Android build guide

## 🐛 Troubleshooting

### Backend Not Connecting
1. Check backend is running: `curl http://localhost:3000/api/music/health`
2. Verify yt-dlp installed: `yt-dlp --version`
3. Check Settings shows correct URL
4. For Android emulator, use `10.0.2.2:3000`
5. For physical device, use computer's IP

### Audio Not Playing
1. Check internet connection
2. Try different search result
3. Verify backend status (if enabled)
4. Check device volume
5. Restart app

### Search Slow
- yt-dlp searches can take 5-10 seconds
- This is normal for first search
- Backend is faster than Invidious
- Consider implementing caching

## 🚀 Deployment

### Backend Options
- **Docker**: Containerized deployment
- **Heroku**: Cloud platform
- **AWS/GCP**: Cloud servers
- **VPS**: Self-hosted

### Frontend
- **EAS Build**: Official Expo build service
- **APK**: Direct Android installation
- **Play Store**: Production deployment

## 🎯 Future Enhancements

- [ ] Download for offline playback
- [ ] Lyrics integration
- [ ] Audio equalizer
- [ ] Sleep timer
- [ ] Playlist sharing
- [ ] Social features
- [ ] Audio visualization
- [ ] Cross-fade transitions
- [ ] Smart recommendations
- [ ] Cloud sync

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 🙏 Credits

- **yt-dlp**: YouTube downloader
- **Expo**: React Native framework
- **React Navigation**: Navigation library
- **expo-av**: Audio playback
- **Express**: Backend framework

## 📞 Support

### Documentation
- Setup: `SETUP_GUIDE.md`
- User Guide: `MUSIC_PLAYER_GUIDE.md`
- Backend: `backend/README.md`

### Getting Help
1. Check documentation
2. Verify prerequisites installed
3. Check logs (backend and frontend)
4. Test endpoints with curl
5. Open issue on GitHub

## 🎓 Learning Resources

- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [Expo Docs](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Express.js](https://expressjs.com/)

---

**Built with ❤️ using React Native, Expo, and yt-dlp**

Enjoy unlimited music streaming with high-quality audio! 🎵
