# Complete Setup Guide - Music Player with yt-dlp Backend

This guide will help you set up the complete music player application with yt-dlp backend support.

## Architecture Overview

```
┌─────────────────────────────────────┐
│   React Native Expo App (Frontend)  │
│   - Music Player UI                 │
│   - Search Interface                │
│   - Playlist Management             │
└──────────────┬──────────────────────┘
               │ HTTP REST API
               │
┌──────────────▼──────────────────────┐
│   Node.js Backend (API Server)      │
│   - Express REST API                │
│   - yt-dlp Service Wrapper          │
│   - Audio URL Extraction            │
└──────────────┬──────────────────────┘
               │ Shell Commands
               │
┌──────────────▼──────────────────────┐
│   yt-dlp (YouTube Downloader)       │
│   - YouTube Audio Extraction        │
│   - Video Metadata                  │
│   - Direct Stream URLs              │
└─────────────────────────────────────┘
```

## Prerequisites

### System Requirements
- **Node.js**: v16 or later
- **Python**: 3.7 or later
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Expo CLI**

### Operating System
- **Linux/macOS**: Fully supported
- **Windows**: Supported with some adjustments

## Part 1: Backend Setup

### Step 1: Install Python and yt-dlp

#### Linux/macOS
```bash
# Check Python version
python3 --version

# Install yt-dlp
pip3 install -U yt-dlp

# Verify installation
yt-dlp --version
```

#### Windows
```bash
# Install Python from python.org
# Then install yt-dlp
pip install -U yt-dlp

# Or use winget
winget install yt-dlp
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend

```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

Update `.env`:
```env
PORT=3000
NODE_ENV=development
YTDLP_PATH=/usr/local/bin/yt-dlp
CACHE_DIR=./cache
```

### Step 4: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
🎵 Music Player API Server
🚀 Server running on http://localhost:3000
📡 API endpoints available at http://localhost:3000/api/music
```

### Step 5: Test Backend

```bash
# Test health endpoint
curl http://localhost:3000/api/music/health

# Test search
curl "http://localhost:3000/api/music/search?query=lofi%20music&limit=5"

# Test audio URL
curl http://localhost:3000/api/music/audio/jfKfPfyJRdk
```

## Part 2: Frontend Setup

### Step 1: Install Frontend Dependencies

```bash
# From project root
npm install
```

### Step 2: Configure Frontend

The frontend automatically detects if backend is running. No configuration needed for development.

For production, update `src/services/BackendMusicService.ts`:

```typescript
const API_BASE = __DEV__ 
  ? 'http://localhost:3000/api/music' 
  : 'https://your-production-backend.com/api/music';
```

### Step 3: Start Frontend

```bash
# Start Expo dev server
npm start

# Or directly on Android
npm run android

# Or on iOS (macOS only)
npm run ios
```

## Part 3: Using the Application

### Enabling Backend API

1. Open the app
2. Navigate to **Settings** tab (⚙️)
3. Enable "Use Backend API (yt-dlp)"
4. Verify Backend Status shows "Online"
5. If offline, check that backend server is running

### Features with Backend

#### Search
- Go to Search tab
- Search for any song/artist
- Results come from yt-dlp (better quality metadata)
- Tap to play

#### Audio Quality
- Backend provides direct audio streams
- Better quality than Invidious
- More reliable playback

#### Playback
- Streams use direct YouTube audio URLs
- No buffering issues
- Better audio quality

## Part 4: Development Workflow

### Running Both Backend and Frontend

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
npm start
# Then press 'a' for Android or 'i' for iOS
```

### Development Tips

1. **Backend Changes**: Nodemon auto-restarts server
2. **Frontend Changes**: Expo hot-reloads automatically
3. **Testing**: Test backend endpoints with curl/Postman first
4. **Logs**: Check both terminals for errors

## Part 5: Troubleshooting

### Backend Issues

#### yt-dlp not found
```bash
# Check if installed
which yt-dlp

# Install if missing
pip3 install -U yt-dlp

# Update PATH in .env
YTDLP_PATH=/usr/local/bin/yt-dlp
```

#### Port 3000 already in use
```bash
# Change port in backend/.env
PORT=3001

# Update frontend BackendMusicService.ts
const API_BASE = 'http://localhost:3001/api/music';
```

#### Permission errors
```bash
# Make yt-dlp executable
chmod +x $(which yt-dlp)
```

### Frontend Issues

#### Cannot connect to backend
1. Check backend is running: `curl http://localhost:3000/api/music/health`
2. Check Settings shows backend URL correctly
3. For Android emulator, use `10.0.2.2:3000` instead of `localhost:3000`
4. For physical device, use computer's IP: `192.168.1.x:3000`

#### Slow searches
- yt-dlp searches can take 5-10 seconds
- This is normal for first search
- Results are not cached by default

### Android Emulator Networking

If using Android emulator, backend URL should be:
```
http://10.0.2.2:3000/api/music
```

For physical Android device on same network:
```
http://192.168.1.x:3000/api/music
```

Replace `x` with your computer's IP.

## Part 6: Building for Production

### Backend Deployment

#### Using Docker

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip
RUN pip3 install -U yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t music-player-backend .
docker run -p 3000:3000 music-player-backend
```

#### Using Heroku

```bash
cd backend

# Create Procfile
echo "web: npm start" > Procfile

# Add buildpacks
heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 heroku/nodejs

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Frontend Deployment

```bash
# Build APK
eas build --platform android --profile production

# Or generate native folders
expo prebuild
cd android
./gradlew assembleRelease
```

## Part 7: Feature Comparison

### Invidious API (Default)
✅ No backend required
✅ Works immediately
❌ Sometimes unreliable
❌ Audio quality varies
❌ Rate limiting issues

### yt-dlp Backend
✅ Better audio quality
✅ More reliable
✅ Direct YouTube streams
✅ Better metadata
✅ No rate limiting
❌ Requires backend server
❌ More setup needed

## Part 8: Advanced Configuration

### Custom yt-dlp Options

Edit `backend/src/services/ytdlpService.js`:

```javascript
async getAudioUrl(videoId) {
  const command = `${this.ytdlpPath} "https://www.youtube.com/watch?v=${videoId}" \\
    -f "bestaudio[ext=m4a]" \\  // Prefer M4A format
    --format-sort "abr" \\      // Sort by audio bitrate
    --get-url`;
  // ...
}
```

### Caching

Implement Redis caching for search results:

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

async search(query) {
  const cacheKey = `search:${query}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const results = await ytdlpService.search(query);
  await client.setEx(cacheKey, 3600, JSON.stringify(results));
  
  return results;
}
```

### Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Part 9: Monitoring

### Backend Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Frontend Analytics

Track usage in Settings screen:

```typescript
import * as Analytics from 'expo-firebase-analytics';

Analytics.logEvent('backend_api_enabled', {
  timestamp: new Date().toISOString()
});
```

## Part 10: Security Best Practices

### Backend Security

1. **Environment Variables**: Never commit .env
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Prevent API abuse
4. **CORS**: Configure appropriately
5. **HTTPS**: Use HTTPS in production

### API Keys (Optional)

Add API key authentication:

```javascript
const API_KEY = process.env.API_KEY;

app.use('/api/', (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## Support

### Getting Help

1. Check logs in both terminals
2. Test backend independently with curl
3. Verify yt-dlp works: `yt-dlp --version`
4. Check network connectivity
5. Review this guide

### Common Questions

**Q: Do I need the backend?**
A: No, the app works with Invidious API by default. Backend is optional for better quality.

**Q: Can I deploy backend to cloud?**
A: Yes! Use Docker, Heroku, AWS, or any Node.js hosting.

**Q: Is yt-dlp legal?**
A: yt-dlp is legal. Respect YouTube's Terms of Service and copyright laws.

**Q: Why is search slow?**
A: yt-dlp needs to fetch data from YouTube. First search takes longer.

## Next Steps

- [x] Set up backend
- [x] Set up frontend
- [x] Test integration
- [ ] Deploy to production
- [ ] Add caching
- [ ] Monitor usage
- [ ] Optimize performance

## Resources

- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [Express.js Guide](https://expressjs.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

---

**Need help?** Check backend logs and ensure yt-dlp is installed correctly.
