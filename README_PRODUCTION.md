# 🎵 Music Player App - Production Ready

A production-ready music streaming and download application with YouTube integration, bundled in a single container.

## ✨ Features

- 🎵 **Stream Music** - Stream audio from YouTube
- 📥 **Download Tracks** - Download individual tracks
- 📁 **Download Playlists** - Batch download entire playlists
- 🌐 **Public Access** - Built-in ngrok support for public URLs
- 🐳 **Single Container** - Everything in one Docker container
- 🚀 **One Command** - Start everything with `./start.sh --docker`
- 🔒 **Production Security** - Rate limiting, CORS, security headers
- 📊 **Health Monitoring** - Built-in health checks
- 🔄 **Auto-Recovery** - Automatic service restart on failure
- 📝 **Comprehensive Logging** - Detailed logs for debugging

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR Node.js 18+ and Python 3.8+

### One Command Start

```bash
# With Docker (recommended)
./start.sh --docker

# Without Docker
./start.sh
```

That's it! Everything is running.

---

## 📦 What Gets Started

When you run `./start.sh --docker`:

1. ✅ Backend API server (port 3000)
2. ✅ yt-dlp for YouTube extraction
3. ✅ Download service for playlists
4. ✅ ngrok tunnel (if configured)
5. ✅ Health monitoring
6. ✅ Logging system

---

## 🔧 Configuration

### ngrok Setup (Optional - For Public URL)

1. Get auth token from [ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Set environment variable:

```bash
export NGROK_AUTHTOKEN=your_token_here
```

3. Start the application:

```bash
./start.sh --docker
```

Your public URL will be displayed in the logs.

---

## 📡 API Endpoints

### Music Streaming

```bash
# Search
GET /api/music/search?query=lofi&limit=10

# Get video info
GET /api/music/video/:videoId

# Get audio URL
GET /api/music/audio/:videoId

# Stream audio
GET /api/music/stream/:videoId

# Trending
GET /api/music/trending?region=US
```

### Downloads

```bash
# Download single track
POST /api/music/download/track/:videoId?format=mp3&quality=0

# Download playlist
POST /api/music/download/playlist/:playlistId

# Get download status
GET /api/music/download/status/:downloadId

# List all downloads
GET /api/music/downloads

# Cancel download
DELETE /api/music/download/:downloadId

# List downloaded files
GET /api/music/downloads/files

# Download file
GET /api/music/downloads/files/:filename

# Delete file
DELETE /api/music/downloads/files/:filename
```

### Health & Status

```bash
# Health check
GET /api/music/health

Response:
{
  "status": "ok",
  "ytdlp": {
    "installed": true,
    "version": "2025.12.08"
  },
  "timestamp": "2025-12-14T..."
}
```

---

## 🎯 Usage Examples

### Stream Music

```bash
# Search for music
curl "http://localhost:3000/api/music/search?query=lofi&limit=5"

# Get audio stream URL
curl "http://localhost:3000/api/music/audio/jfKfPfyJRdk"

# Or stream directly
open "http://localhost:3000/api/music/stream/jfKfPfyJRdk"
```

### Download Music

```bash
# Download a track in MP3 format
curl -X POST "http://localhost:3000/api/music/download/track/jfKfPfyJRdk?format=mp3&quality=0"

# Download entire playlist
curl -X POST "http://localhost:3000/api/music/download/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"

# Check download status
curl "http://localhost:3000/api/music/download/status/<downloadId>"

# List downloaded files
curl "http://localhost:3000/api/music/downloads/files"

# Download the file
curl -O "http://localhost:3000/api/music/downloads/files/jfKfPfyJRdk.mp3"
```

---

## 🐳 Docker Commands

```bash
# Start
docker-compose -f docker-compose.prod.yml up -d

# Stop
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Check status
docker-compose -f docker-compose.prod.yml ps

# Enter container
docker-compose -f docker-compose.prod.yml exec music-player sh

# View resource usage
docker stats
```

---

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:3000/api/music/health
```

### Logs

```bash
# Docker logs
docker-compose -f docker-compose.prod.yml logs -f

# Local logs
tail -f logs/backend.log
tail -f logs/ngrok.log
```

### ngrok Dashboard

If ngrok is enabled, view the dashboard at:
```
http://localhost:4040
```

---

## 🔒 Security

### Production Security Features

- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Security headers
- ✅ Input validation
- ✅ No SQL injection (no database)
- ✅ XSS protection
- ✅ Container security (non-root user, read-only where possible)

### Security Configuration

Edit `.env` or `docker-compose.prod.yml`:

```env
# Rate limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# CORS
CORS_ORIGIN=https://your-domain.com

# Security keys
SECRET_KEY=your-secret-key
```

---

## 🔄 Maintenance

### Update yt-dlp

```bash
# Docker
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp

# Local
pip3 install -U yt-dlp
```

### Clean Up Old Downloads

```bash
# Docker
docker-compose -f docker-compose.prod.yml exec music-player rm -rf /app/backend/downloads/*

# Local
rm -rf backend/downloads/*
```

### Backup

```bash
# Backup downloads volume
docker run --rm -v music-downloads:/data -v $(pwd):/backup alpine tar czf /backup/downloads-backup.tar.gz -C /data .

# Restore
docker run --rm -v music-downloads:/data -v $(pwd):/backup alpine tar xzf /backup/downloads-backup.tar.gz -C /data
```

---

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start in development mode
./start.sh

# Backend only
cd backend && npm start

# With nodemon (auto-restart)
cd backend && npm run dev
```

### Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=3000
YTDLP_PATH=/usr/local/bin/yt-dlp
CACHE_DIR=./backend/cache
DOWNLOADS_DIR=./backend/downloads
NGROK_AUTHTOKEN=your_token_here
```

---

## 📁 Project Structure

```
.
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   └── routes/         # API routes
│   ├── cache/              # yt-dlp cache
│   └── downloads/          # Downloaded files
├── docker/                  # Docker files
│   └── start.sh            # Container startup script
├── logs/                    # Application logs
├── Dockerfile              # Production Dockerfile
├── docker-compose.prod.yml # Production compose file
├── start.sh                # One-command startup
└── README_PRODUCTION.md    # This file
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Rebuild
docker-compose -f docker-compose.prod.yml build --no-cache

# Check resources
docker stats
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>

# Or change port in docker-compose.prod.yml
```

### yt-dlp Errors

```bash
# Update yt-dlp
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp

# Test
docker-compose -f docker-compose.prod.yml exec music-player yt-dlp --version
```

### Download Failed

- Check disk space: `df -h`
- Check yt-dlp version: Update if needed
- Check video availability: Some videos can't be downloaded
- Check logs: `docker-compose -f docker-compose.prod.yml logs`

---

## 📚 Documentation

- **[PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md)** - Complete production deployment guide
- **[INSTALL_COMMANDS.txt](INSTALL_COMMANDS.txt)** - Installation commands
- **[UBUNTU_INSTALLATION.md](UBUNTU_INSTALLATION.md)** - Ubuntu setup guide
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide

---

## 🚀 Deployment Options

### Option 1: Docker (Recommended)
```bash
./start.sh --docker
```

### Option 2: Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Local
```bash
./start.sh
```

### Option 4: Cloud Deployment

Deploy to cloud providers:

- **AWS**: ECS, Fargate, or EC2
- **Google Cloud**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **DigitalOcean**: App Platform or Droplets
- **Heroku**: Container Registry

Example for AWS ECS:
```bash
# Build and push
docker build -t music-player:latest .
docker tag music-player:latest <ecr-repo>:latest
docker push <ecr-repo>:latest

# Deploy to ECS
aws ecs update-service --cluster <cluster> --service music-player --force-new-deployment
```

---

## 📈 Scaling

For high traffic:

1. **Load Balancer**: nginx or cloud load balancer
2. **Multiple Instances**: Scale horizontally
3. **Cache**: Redis for API responses
4. **CDN**: CloudFlare or AWS CloudFront
5. **Database**: PostgreSQL for downloads tracking
6. **Queue**: Bull or RabbitMQ for downloads

---

## 🆘 Support

### Quick Checks

```bash
# 1. Check if running
curl http://localhost:3000/api/music/health

# 2. Check logs
docker-compose -f docker-compose.prod.yml logs --tail=50

# 3. Check container status
docker-compose -f docker-compose.prod.yml ps

# 4. Check disk space
df -h

# 5. Check memory
free -h
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Change port or kill process |
| yt-dlp fails | Update yt-dlp |
| Out of disk | Clean downloads directory |
| High memory | Restart container |
| ngrok not working | Check auth token |

---

## 📄 License

MIT License - See LICENSE file

---

## 🎉 Quick Reference

```bash
# Start everything
./start.sh --docker

# Stop everything
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Health check
curl http://localhost:3000/api/music/health

# Search music
curl "http://localhost:3000/api/music/search?query=lofi&limit=5"

# Download track
curl -X POST "http://localhost:3000/api/music/download/track/VIDEO_ID"

# Download playlist
curl -X POST "http://localhost:3000/api/music/download/playlist/PLAYLIST_ID"

# ngrok dashboard
open http://localhost:4040
```

---

**🎵 Everything in one container. One command to rule them all!**

Run `./start.sh --docker` and you're ready to go!
