# 🎵 Music Player - ONE COMMAND TO RUN EVERYTHING

## ⚡ Super Quick Start

```bash
./run.sh
```

That's it! Just run that ONE command and everything starts:

- ✅ Backend API
- ✅ yt-dlp integration
- ✅ Download service
- ✅ ngrok (if configured)
- ✅ Health monitoring
- ✅ Auto-restart

---

## 🚀 What Happens

When you run `./run.sh`:

1. Checks if Docker is installed
2. Builds the container (first time only)
3. Starts all services
4. Waits for health check
5. Shows you the URLs to access

### Output Example:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              🎵 MUSIC PLAYER - ONE COMMAND DEPLOY              ║
║                                                                ║
║         Frontend + Backend + yt-dlp + ngrok + Downloads        ║
║                    ALL IN ONE CONTAINER                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

[✓] Docker is available

═══════════════════════════════════════════════════════
  What would you like to do?
═══════════════════════════════════════════════════════

  1) 🚀 Start Everything (Recommended)
  2) 🔨 Build Container
  3) ⏹️  Stop Everything
  4) 📊 View Status
  5) 📝 View Logs
  6) 🔄 Restart Services
  7) 🧹 Clean Up
  8) 🌐 Setup ngrok
  9) 🔍 Health Check
  0) ❌ Exit

Choose an option [1]: 1

[11:20:30] 🚀 Starting Music Player App...
[11:20:31] 🎵 Starting services...
[11:20:42] ⏳ Waiting for services to start...
[11:20:52] ✅ Backend is healthy!

╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              ✅ MUSIC PLAYER IS RUNNING!                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

📊 Services:
  • Backend API:     http://localhost:3000
  • Health Check:    http://localhost:3000/api/music/health
  • ngrok Dashboard: http://localhost:4040

🌐 Public URL: https://your-random-url.ngrok.io

📚 Quick Commands:
  • View logs:    docker-compose -f docker-compose.prod.yml logs -f
  • Stop:         docker-compose -f docker-compose.prod.yml down
  • Restart:      docker-compose -f docker-compose.prod.yml restart

🎵 Try it:
  curl "http://localhost:3000/api/music/search?query=lofi&limit=5"
```

---

## 🎯 Interactive Menu

The `run.sh` script provides an interactive menu:

### Option 1: Start Everything
- Builds container if needed
- Starts all services
- Shows URLs and status
- **This is what you want 99% of the time**

### Option 2: Build Container
- Rebuilds the Docker image
- Use this after code changes

### Option 3: Stop Everything
- Gracefully stops all services
- Data is preserved

### Option 4: View Status
- Shows if services are running
- Displays health check status

### Option 5: View Logs
- Live log output
- Press Ctrl+C to exit

### Option 6: Restart Services
- Quick restart without rebuilding

### Option 7: Clean Up
- Removes everything
- **Warning**: Deletes downloads!

### Option 8: Setup ngrok
- Shows ngrok setup instructions

### Option 9: Health Check
- Tests if everything is working

---

## 🌐 Adding Public URL (ngrok)

Before running, set your ngrok token:

```bash
export NGROK_AUTHTOKEN=your_token_here
./run.sh
```

Get token: https://dashboard.ngrok.com/get-started/your-authtoken

---

## 📦 What's Included in the Container

The single container includes:

1. **Backend API Server**
   - Node.js 20
   - Express server
   - Port 3000

2. **yt-dlp**
   - Latest version
   - YouTube audio extraction
   - Auto-configured

3. **Download Service**
   - Download single tracks
   - Download playlists
   - Batch processing

4. **ngrok**
   - Public URL generation
   - Dashboard on port 4040
   - Optional (requires token)

5. **Health Monitoring**
   - Automatic health checks
   - Auto-restart on failure

6. **Volumes**
   - Downloads: Persisted
   - Cache: Persisted
   - Logs: Persisted

---

## 🎵 Using the API

### Stream Music
```bash
# Search
curl "http://localhost:3000/api/music/search?query=lofi&limit=5"

# Get audio URL
curl "http://localhost:3000/api/music/audio/VIDEO_ID"

# Stream
open "http://localhost:3000/api/music/stream/VIDEO_ID"
```

### Download Music
```bash
# Download track
curl -X POST "http://localhost:3000/api/music/download/track/VIDEO_ID"

# Download playlist
curl -X POST "http://localhost:3000/api/music/download/playlist/PLAYLIST_ID"

# Check status
curl "http://localhost:3000/api/music/downloads"

# Download file
curl -O "http://localhost:3000/api/music/downloads/files/FILENAME.mp3"
```

---

## 🔧 Management Commands

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Stop
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Enter Container
```bash
docker-compose -f docker-compose.prod.yml exec music-player sh
```

### Update yt-dlp
```bash
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp
```

---

## 📊 Monitoring

### Check Health
```bash
curl http://localhost:3000/api/music/health
```

### View Container Stats
```bash
docker stats music-player-production
```

### Check Disk Space
```bash
docker-compose -f docker-compose.prod.yml exec music-player df -h
```

---

## 🐛 Troubleshooting

### Container Won't Start

1. Check Docker is running:
```bash
docker ps
```

2. View logs:
```bash
docker-compose -f docker-compose.prod.yml logs
```

3. Rebuild:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Port Already in Use

Check what's using port 3000:
```bash
sudo lsof -i :3000
```

Kill it or change the port in `docker-compose.prod.yml`.

### Out of Disk Space

Clean up old downloads:
```bash
docker-compose -f docker-compose.prod.yml exec music-player rm -rf /app/backend/downloads/*
```

### ngrok Not Working

1. Check token is set:
```bash
echo $NGROK_AUTHTOKEN
```

2. View ngrok logs:
```bash
docker-compose -f docker-compose.prod.yml logs music-player | grep ngrok
```

---

## 🎉 Summary

| Command | What it does |
|---------|--------------|
| `./run.sh` | Interactive menu |
| `./run.sh` then `1` | Start everything |
| `./run.sh` then `3` | Stop everything |
| `./run.sh` then `5` | View logs |

**That's all you need to know!**

---

## 🚀 Quick Reference

```bash
# Start
./run.sh
# Press 1 and Enter

# Access
open http://localhost:3000/api/music/health

# Stop
./run.sh
# Press 3 and Enter
```

---

## 🌟 Features

- ✅ **One Command**: Just `./run.sh`
- ✅ **One Container**: Everything bundled
- ✅ **Interactive Menu**: Easy management
- ✅ **Download Support**: Tracks & playlists
- ✅ **Public URL**: ngrok integrated
- ✅ **Production Ready**: Security, monitoring, auto-restart
- ✅ **Persistent Data**: Downloads and cache saved
- ✅ **Health Checks**: Auto-recovery
- ✅ **Easy Logs**: View with one command
- ✅ **Simple Updates**: Rebuild when needed

---

## 📚 More Documentation

- **[PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md)** - Complete production guide
- **[README_PRODUCTION.md](README_PRODUCTION.md)** - Production README
- **[DEPLOYMENT_COMPLETE.md](DEPLOYMENT_COMPLETE.md)** - Deployment details
- **[UBUNTU_INSTALLATION.md](UBUNTU_INSTALLATION.md)** - Ubuntu setup
- **[INSTALL_COMMANDS.txt](INSTALL_COMMANDS.txt)** - Quick commands

---

**Everything in ONE command. Music in ONE container. Simple as that!** 🎵

```bash
./run.sh
```
