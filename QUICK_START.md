# Quick Start Guide - Music Player Backend

## ✅ Backend Server is RUNNING!

### Server Details
```
🎵 Music Player API Server
🚀 Running on: http://localhost:3000
📡 API Base: http://localhost:3000/api/music
✅ Status: OPERATIONAL
🔧 yt-dlp: v2025.12.08
```

## Quick Test

### 1. Health Check
```bash
curl http://localhost:3000/api/music/health
```

Expected Response:
```json
{
  "status": "ok",
  "ytdlp": {
    "installed": true,
    "version": "2025.12.08"
  },
  "timestamp": "2025-12-13T..."
}
```

### 2. Search Music
```bash
curl "http://localhost:3000/api/music/search?query=lofi&limit=5"
```

### 3. Get Audio URL
```bash
curl http://localhost:3000/api/music/audio/jfKfPfyJRdk
```

## Start Frontend App

### Terminal 1: Backend (Already Running ✅)
```bash
cd /home/engine/project/backend
# Server is running on PID: 33749
# View logs: tail -f server.log
```

### Terminal 2: Frontend
```bash
cd /home/engine/project
npm start
# Then press 'a' for Android or 'i' for iOS
```

## Configure Frontend to Use Backend

1. Open the app on your device/emulator
2. Navigate to **Settings** tab (⚙️ icon)
3. Toggle **"Use Backend API (yt-dlp)"** ON
4. Set **Backend URL**:
   - **Android Emulator**: `http://10.0.2.2:3000/api/music`
   - **Physical Device**: `http://192.168.x.x:3000/api/music`
   - **iOS Simulator**: `http://localhost:3000/api/music`
5. Verify status shows **"Online"** (green badge)

## Get Your Computer's IP

### Linux/Mac
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# or
ip addr show | grep "inet " | grep -v 127.0.0.1
```

### Windows
```bash
ipconfig
```

Use the IP address (e.g., 192.168.1.100) in the app's backend URL setting.

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/music/health` | GET | Check server health |
| `/api/music/search` | GET | Search YouTube for music |
| `/api/music/trending` | GET | Get trending music videos |
| `/api/music/video/:id` | GET | Get video information |
| `/api/music/audio/:id` | GET | Get direct audio stream URL |
| `/api/music/formats/:id` | GET | Get available audio formats |
| `/api/music/stream/:id` | GET | Redirect to audio stream |

## Example Usage

### Search for Music
```bash
curl "http://localhost:3000/api/music/search?query=lofi%20music&limit=10"
```

### Get Trending Music
```bash
curl "http://localhost:3000/api/music/trending?region=US"
```

### Get Video Details
```bash
curl "http://localhost:3000/api/music/video/jfKfPfyJRdk"
```

### Get Audio URL
```bash
curl "http://localhost:3000/api/music/audio/jfKfPfyJRdk"
```

Response:
```json
{
  "url": "https://rr1---sn-...",
  "videoId": "jfKfPfyJRdk"
}
```

## Server Management

### View Logs
```bash
tail -f /home/engine/project/backend/server.log
```

### Check Status
```bash
ps aux | grep "node src/index.js" | grep -v grep
```

### Stop Server
```bash
pkill -f "node src/index.js"
# or
kill 33749
```

### Restart Server
```bash
cd /home/engine/project/backend
npm start > server.log 2>&1 &
```

## Troubleshooting

### Backend Not Accessible from App

**Problem**: Frontend can't connect to backend

**Solutions**:
1. **For Android Emulator**: Use `10.0.2.2` instead of `localhost`
2. **For Physical Device**: Use computer's IP address (e.g., `192.168.1.100`)
3. **Check Firewall**: Ensure port 3000 is not blocked
4. **Verify Server**: `curl http://localhost:3000/api/music/health`

### Slow Searches

**Problem**: Searches take 5-10 seconds

**Explanation**: This is normal for yt-dlp as it needs to fetch data from YouTube

**Solutions**:
- First search is always slower
- Use smaller limit values
- Implement caching (for production)

### yt-dlp Errors

**Problem**: Commands fail or return errors

**Solutions**:
```bash
# Update yt-dlp
pip3 install --break-system-packages -U yt-dlp

# Check version
yt-dlp --version

# Test manually
yt-dlp --get-url "https://youtube.com/watch?v=jfKfPfyJRdk"
```

## Testing Complete Flow

### 1. Test Backend
```bash
# Health check
curl http://localhost:3000/api/music/health

# Search
curl "http://localhost:3000/api/music/search?query=test&limit=2"
```

### 2. Start Frontend
```bash
cd /home/engine/project
npm start
```

### 3. Configure in App
- Open Settings tab
- Enable "Use Backend API"
- Set correct URL for your setup
- Verify "Online" status

### 4. Test Playback
- Go to Search tab
- Search for music
- Tap to play
- Verify audio plays through backend

## Performance Tips

1. **Caching**: Implement Redis for production
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Multiple Instances**: Load balance with multiple backend instances
4. **CDN**: Cache audio streams with CDN
5. **Queue**: Use queue system for heavy requests

## Security Notes

1. **Production**: Use HTTPS
2. **API Keys**: Implement authentication for production
3. **CORS**: Configure CORS appropriately
4. **Rate Limiting**: Prevent API abuse
5. **Input Validation**: All inputs are validated

## Next Steps

- [x] Backend is running ✅
- [x] yt-dlp is working ✅
- [x] API endpoints tested ✅
- [ ] Start frontend app
- [ ] Connect frontend to backend
- [ ] Test end-to-end music playback
- [ ] Build Android APK
- [ ] Deploy to production

## Support

### Documentation
- **Setup Guide**: `SETUP_GUIDE.md`
- **Backend API**: `backend/README.md`
- **Integration**: `BACKEND_INTEGRATION.md`
- **Server Status**: `SERVER_STATUS.md`

### Useful Commands
```bash
# Backend directory
cd /home/engine/project/backend

# View logs
tail -f server.log

# Test endpoint
curl http://localhost:3000/api/music/health

# Check port
ss -tulpn | grep 3000

# Restart
pkill -f "node src/index.js" && npm start > server.log 2>&1 &
```

---

🎵 **Backend Server Ready!** Start the frontend and enjoy unlimited music streaming!
