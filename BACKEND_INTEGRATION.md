# Backend Integration Guide

Complete guide for integrating the yt-dlp backend with the React Native frontend.

## Overview

The app supports two modes:
1. **Invidious API** (Default): No backend needed, works out of the box
2. **yt-dlp Backend** (Optional): Better quality, more reliable, requires backend server

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React Native)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           MusicPlayerContext (Global State)              │   │
│  │  - Current Track   - Queue    - Playlists               │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │                                       │
│  ┌───────────────────────▼──────────────────────────────────┐   │
│  │                    Settings Check                         │   │
│  │              useBackendApi === true ?                     │   │
│  └──────┬─────────────────────────────────────┬─────────────┘   │
│         │ YES                                  │ NO              │
│         │                                      │                 │
│  ┌──────▼────────────┐              ┌─────────▼─────────────┐   │
│  │ BackendMusicService│              │  YouTubeService       │   │
│  │   (yt-dlp API)    │              │  (Invidious API)      │   │
│  └──────┬─────────────┘              └─────────┬─────────────┘   │
│         │                                      │                 │
└─────────┼──────────────────────────────────────┼─────────────────┘
          │                                      │
          │ HTTP                                 │ HTTP
          │                                      │
┌─────────▼──────────────┐           ┌───────────▼─────────────┐
│  Node.js Backend       │           │   Invidious Instance    │
│  (localhost:3000)      │           │   (invidious.io.lol)    │
│  ┌──────────────────┐  │           └─────────────────────────┘
│  │  ytdlpService    │  │
│  │  ├─ search()     │  │
│  │  ├─ getAudioUrl()│  │
│  │  └─ getTrending()│  │
│  └────────┬──────────┘  │
│           │              │
└───────────┼──────────────┘
            │ Shell Command
┌───────────▼──────────────┐
│        yt-dlp            │
│  - Extract audio URLs    │
│  - Get metadata          │
└──────────────────────────┘
```

## Implementation Details

### 1. Settings Toggle

File: `src/screens/SettingsScreen.tsx`

```typescript
interface AppSettings {
  useBackendApi: boolean;      // Toggle backend
  backendUrl: string;          // Backend URL
  audioQuality: 'high' | 'medium' | 'low';
  autoPlay: boolean;
  showNotifications: boolean;
}

// Stored in AsyncStorage
const { storedValue: settings, setValue: setSettings } = useStorage<AppSettings>(
  'appSettings',
  {
    useBackendApi: false,                        // Default: use Invidious
    backendUrl: 'http://localhost:3000/api/music',
    audioQuality: 'high',
    autoPlay: true,
    showNotifications: true,
  }
);
```

### 2. Backend Service

File: `src/services/BackendMusicService.ts`

```typescript
class BackendMusicService {
  private apiBase: string;

  constructor(apiBase?: string) {
    this.apiBase = apiBase || API_BASE;
  }

  async search(query: string, limit: number = 20): Promise<SearchResult[]> {
    const response = await axios.get(`${this.apiBase}/search`, {
      params: { query, limit },
      timeout: 30000,
    });
    return response.data.results;
  }

  async getAudioUrl(videoId: string): Promise<string | null> {
    const response = await axios.get(`${this.apiBase}/audio/${videoId}`, {
      timeout: 15000,
    });
    return response.data.url;
  }

  async checkHealth(): Promise<{ status: string; ytdlp: any }> {
    const response = await axios.get(`${this.apiBase}/health`);
    return response.data;
  }
}
```

### 3. Context Integration

File: `src/context/MusicPlayerContext.tsx`

```typescript
const playTrack = useCallback(async (track: Track) => {
  try {
    let audioUrl: string | undefined = track.url;
    
    // Check if we should use backend
    const settings = await getSettings(); // From AsyncStorage
    
    if (!audioUrl && track.videoId) {
      if (settings.useBackendApi) {
        // Use backend API (yt-dlp)
        const backendService = new BackendMusicServiceClass(settings.backendUrl);
        const fetchedUrl = await backendService.getAudioUrl(track.videoId);
        audioUrl = fetchedUrl || undefined;
      } else {
        // Use Invidious API (default)
        audioUrl = await YouTubeService.getAudioUrl(track.videoId);
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
}, []);
```

### 4. Search Screen Integration

File: `src/screens/SearchScreen.tsx`

```typescript
const handleSearch = async () => {
  if (!query.trim()) return;

  setLoading(true);
  try {
    const settings = await getSettings();
    let searchResults;

    if (settings.useBackendApi) {
      // Use backend
      const backendService = new BackendMusicServiceClass(settings.backendUrl);
      searchResults = await backendService.search(query);
    } else {
      // Use Invidious
      searchResults = await YouTubeService.search(query);
    }

    setResults(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    Alert.alert('Error', 'Failed to search. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Backend API Reference

### Base URL
```
http://localhost:3000/api/music
```

### Endpoints

#### 1. Search Videos

```http
GET /api/music/search?query=<query>&limit=<limit>
```

**Parameters:**
- `query` (string, required): Search term
- `limit` (number, optional): Max results (default: 20)

**Response:**
```json
{
  "results": [
    {
      "videoId": "jfKfPfyJRdk",
      "title": "lofi hip hop radio",
      "channelTitle": "Lofi Girl",
      "thumbnail": "https://...",
      "duration": "0:00",
      "durationSeconds": 0,
      "viewCount": "1000000"
    }
  ],
  "count": 10
}
```

#### 2. Get Video Info

```http
GET /api/music/video/:videoId
```

**Response:**
```json
{
  "videoId": "jfKfPfyJRdk",
  "title": "lofi hip hop radio",
  "channelTitle": "Lofi Girl",
  "thumbnail": "https://...",
  "duration": "0:00",
  "durationSeconds": 0,
  "viewCount": "1000000",
  "description": "..."
}
```

#### 3. Get Audio URL

```http
GET /api/music/audio/:videoId
```

**Response:**
```json
{
  "url": "https://rr1---sn-...",
  "videoId": "jfKfPfyJRdk"
}
```

#### 4. Get Trending

```http
GET /api/music/trending?region=<region>
```

**Parameters:**
- `region` (string, optional): Region code (default: US)

#### 5. Stream Audio

```http
GET /api/music/stream/:videoId
```

Redirects to direct audio stream URL.

#### 6. Health Check

```http
GET /api/music/health
```

**Response:**
```json
{
  "status": "ok",
  "ytdlp": {
    "installed": true,
    "version": "2024.10.07"
  },
  "timestamp": "2024-12-13T..."
}
```

## Environment Configuration

### Frontend (.env for web, or hardcoded in app)

```typescript
const API_BASE = __DEV__ 
  ? 'http://localhost:3000/api/music'           // Development
  : 'https://your-backend.com/api/music';      // Production
```

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
YTDLP_PATH=/usr/local/bin/yt-dlp
CACHE_DIR=./cache
MAX_CACHE_SIZE=1000
```

## Network Configuration

### Development

#### Same Computer
```
Backend: http://localhost:3000
Frontend: http://localhost:3000
```

#### Android Emulator
```
Backend: http://10.0.2.2:3000
(10.0.2.2 is emulator's way to reach host machine)
```

#### Physical Device (Same Network)
```
Backend: http://192.168.1.x:3000
(Replace x with your computer's IP)
```

Find your IP:
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

### Production

#### Frontend
Update `BackendMusicService.ts`:
```typescript
const API_BASE = 'https://api.yourdomain.com/api/music';
```

#### Backend
Deploy to:
- Heroku
- AWS/GCP
- Docker container
- VPS

## Error Handling

### Frontend

```typescript
try {
  const url = await backendService.getAudioUrl(videoId);
  if (!url) {
    throw new Error('No audio URL returned');
  }
} catch (error) {
  console.error('Backend error:', error);
  
  // Fallback to Invidious
  try {
    const url = await YouTubeService.getAudioUrl(videoId);
    // Continue with Invidious
  } catch (fallbackError) {
    Alert.alert('Error', 'Unable to play track');
  }
}
```

### Backend

```javascript
async getAudioUrl(videoId) {
  try {
    const command = `${this.ytdlpPath} "..." --get-url`;
    const { stdout } = await execAsync(command);
    return stdout.trim();
  } catch (error) {
    console.error('yt-dlp error:', error);
    throw new Error('Failed to extract audio URL');
  }
}
```

## Testing

### 1. Test Backend Independently

```bash
# Health check
curl http://localhost:3000/api/music/health

# Search
curl "http://localhost:3000/api/music/search?query=test&limit=5"

# Get audio URL
curl http://localhost:3000/api/music/audio/jfKfPfyJRdk
```

### 2. Test Frontend

1. Start backend: `cd backend && npm start`
2. Start frontend: `npm start`
3. Open app on device/emulator
4. Go to Settings
5. Enable "Use Backend API"
6. Verify status shows "Online"
7. Search for music
8. Play a track

### 3. Test Integration

```typescript
// In Settings screen, test connection
const checkBackendStatus = async () => {
  try {
    const service = new BackendMusicServiceClass(localSettings.backendUrl);
    const health = await service.checkHealth();
    
    if (health.status === 'ok') {
      setBackendStatus('online');
      console.log('✅ Backend connected:', health.ytdlp.version);
    }
  } catch (error) {
    setBackendStatus('offline');
    console.error('❌ Backend offline:', error);
  }
};
```

## Performance Optimization

### Caching

Implement caching in backend:

```javascript
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async search(query, limit) {
  const cacheKey = `search:${query}:${limit}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const results = await this.ytdlpSearch(query, limit);
  cache.set(cacheKey, {
    data: results,
    timestamp: Date.now()
  });
  
  return results;
}
```

### Request Debouncing

In frontend search:

```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const results = await backendService.search(query);
  setResults(results);
}, 500);
```

## Security Considerations

### Backend

1. **Input Validation**
```javascript
if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
  return res.status(400).json({ error: 'Invalid video ID' });
}
```

2. **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

3. **CORS Configuration**
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:19000', 'exp://192.168.1.x:19000'],
  credentials: true
}));
```

### Frontend

1. **Timeout Handling**
```typescript
const response = await axios.get(url, {
  timeout: 15000 // 15 seconds
});
```

2. **Error Boundaries**
```typescript
try {
  await playTrack(track);
} catch (error) {
  // Show user-friendly error
  Alert.alert('Playback Error', 'Unable to play track');
}
```

## Troubleshooting Integration

### Issue: Backend not reachable from app

**Solution:**
1. Check backend is running: `curl http://localhost:3000/api/music/health`
2. For emulator: Use `10.0.2.2:3000`
3. For device: Use computer's IP `192.168.1.x:3000`
4. Check firewall allows port 3000

### Issue: yt-dlp commands failing

**Solution:**
1. Verify yt-dlp installed: `yt-dlp --version`
2. Update yt-dlp: `pip3 install -U yt-dlp`
3. Check YTDLP_PATH in .env
4. Test manually: `yt-dlp --get-url "https://youtube.com/watch?v=..."`

### Issue: Slow search responses

**Solution:**
1. Implement caching (see above)
2. Reduce search limit
3. Use trending endpoint for discovery
4. Consider Redis for production

## Advanced Integration

### WebSocket for Real-time Updates

Backend:
```javascript
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('search', async (query) => {
    const results = await ytdlpService.search(query);
    socket.emit('searchResults', results);
  });
});
```

Frontend:
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('searchResults', (results) => {
  setResults(results);
});

socket.emit('search', query);
```

### GraphQL API

Consider GraphQL for more flexible queries:

```graphql
type Query {
  search(query: String!, limit: Int): [Video]
  video(id: ID!): Video
  trending(region: String): [Video]
}

type Video {
  id: ID!
  title: String!
  audioUrl: String
  thumbnail: String
  duration: Int
}
```

## Conclusion

The backend integration provides:
- ✅ Better audio quality
- ✅ More reliable streaming
- ✅ Direct YouTube access
- ✅ Flexible configuration
- ✅ Production-ready architecture

The app works perfectly with or without the backend, giving users the choice!
