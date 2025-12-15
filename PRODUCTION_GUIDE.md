# Production Deployment Guide

Complete guide for deploying the Music Player App in production.

## 🚀 Quick Start - One Command

### Option 1: Docker (Recommended)
```bash
./start.sh --docker
```

### Option 2: Local
```bash
./start.sh
```

That's it! Everything runs with one command.

---

## 📦 What's Included

### Single Container Architecture
- ✅ Backend API (Node.js + Express)
- ✅ yt-dlp for YouTube extraction
- ✅ Download service for playlists
- ✅ ngrok for public URL
- ✅ Health monitoring
- ✅ Automatic restarts
- ✅ Logging system

### Features
- 🎵 Music streaming
- 📥 Download tracks and playlists
- 🌐 Public URL with ngrok
- 🔒 Production security
- 📊 Health monitoring
- 🔄 Auto-recovery
- 📝 Comprehensive logging

---

## 🐳 Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 10GB disk space

### Build and Run
```bash
# Build the image
docker-compose -f docker-compose.prod.yml build

# Start the container
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

### With ngrok
```bash
# Set your ngrok auth token
export NGROK_AUTHTOKEN=your_token_here

# Start with ngrok
docker-compose -f docker-compose.prod.yml up -d

# Get public URL
docker-compose -f docker-compose.prod.yml logs | grep "Public URL"
```

---

## 💻 Local Deployment

### Prerequisites
- Node.js 18+
- Python 3.8+
- yt-dlp
- 2GB RAM minimum

### Setup
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Install yt-dlp
pip3 install -U yt-dlp

# Start application
./start.sh
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
cp .env.production .env
```

Edit `.env`:
```env
# Backend
PORT=3000
NODE_ENV=production

# yt-dlp
YTDLP_PATH=/usr/local/bin/yt-dlp

# Storage
CACHE_DIR=/app/backend/cache
DOWNLOADS_DIR=/app/backend/downloads

# ngrok (optional)
NGROK_AUTHTOKEN=your_token_here

# Security
CORS_ORIGIN=*
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker Environment

For Docker deployment, set environment variables in `docker-compose.prod.yml` or use an `.env` file.

---

## 📥 Download Features

### Download Single Track
```bash
POST /api/music/download/track/:videoId
```

Query parameters:
- `format`: mp3, m4a, wav (default: mp3)
- `quality`: 0-9 (0 = best, default: 0)

Example:
```bash
curl -X POST "http://localhost:3000/api/music/download/track/jfKfPfyJRdk?format=mp3&quality=0"
```

### Download Playlist
```bash
POST /api/music/download/playlist/:playlistId
```

Example:
```bash
curl -X POST "http://localhost:3000/api/music/download/playlist/PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"
```

### Get Download Status
```bash
GET /api/music/download/status/:downloadId
```

### List All Downloads
```bash
GET /api/music/downloads
```

### Downloaded Files
```bash
# List files
GET /api/music/downloads/files

# Download file
GET /api/music/downloads/files/:filename

# Delete file
DELETE /api/music/downloads/files/:filename
```

---

## 🌐 Public URL with ngrok

### Setup ngrok

1. Sign up at [ngrok.com](https://ngrok.com)
2. Get your auth token from [dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Set environment variable:

```bash
export NGROK_AUTHTOKEN=your_token_here
```

### With Docker
```bash
# Start with ngrok
NGROK_AUTHTOKEN=your_token docker-compose -f docker-compose.prod.yml up -d

# Get URL from logs
docker-compose -f docker-compose.prod.yml logs | grep "Public URL"

# Or from ngrok dashboard
open http://localhost:4040
```

### Without Docker
```bash
# Set token
export NGROK_AUTHTOKEN=your_token

# Start application
./start.sh

# Public URL will be shown in output
```

---

## 🔒 Security Best Practices

### 1. API Rate Limiting
Already implemented in the backend:
- 100 requests per 15 minutes per IP
- Configurable via `RATE_LIMIT_MAX_REQUESTS`

### 2. CORS Configuration
Configure allowed origins:
```env
CORS_ORIGIN=https://your-domain.com
```

### 3. Environment Variables
Never commit sensitive data:
- Use `.env` files
- Add `.env` to `.gitignore`
- Use secrets management in production

### 4. Docker Security
- Runs as non-root user
- Read-only filesystem where possible
- No new privileges
- Security scanning with Trivy:

```bash
trivy image music-player-production
```

### 5. Regular Updates
```bash
# Update yt-dlp
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp

# Update Node packages
docker-compose -f docker-compose.prod.yml exec music-player npm update
```

---

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/music/health
```

Response:
```json
{
  "status": "ok",
  "ytdlp": {
    "installed": true,
    "version": "2025.12.08"
  },
  "timestamp": "2025-12-14T..."
}
```

### Logs

#### Docker
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Backend only
docker-compose -f docker-compose.prod.yml logs -f music-player

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

#### Local
```bash
# Backend logs
tail -f logs/backend.log

# ngrok logs
tail -f logs/ngrok.log
```

### Metrics
Monitor these key metrics:
- CPU usage
- Memory usage
- Disk space (downloads directory)
- Request rate
- Error rate

---

## 🔄 Maintenance

### Cleanup Old Downloads
```bash
# Manually
curl -X POST http://localhost:3000/api/music/cleanup

# Or via cron (every day at 3 AM)
0 3 * * * curl -X POST http://localhost:3000/api/music/cleanup
```

### Clear Cache
```bash
# Docker
docker-compose -f docker-compose.prod.yml exec music-player rm -rf /app/backend/cache/*

# Local
rm -rf backend/cache/*
```

### Update yt-dlp
```bash
# Docker
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp

# Local
pip3 install -U yt-dlp
```

### Backup Downloads
```bash
# Docker volumes
docker run --rm -v music-downloads:/data -v $(pwd):/backup alpine tar czf /backup/downloads-backup.tar.gz -C /data .

# Local
tar czf downloads-backup.tar.gz backend/downloads/
```

---

## 🚀 Scaling

### Horizontal Scaling

Use Docker Swarm or Kubernetes:

```bash
# Docker Swarm example
docker swarm init
docker stack deploy -c docker-compose.prod.yml music-player
docker service scale music-player_music-player=3
```

### Load Balancing

Add nginx reverse proxy:

```nginx
upstream music_backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://music_backend;
    }
}
```

### Database for Downloads

For production with multiple instances, use a shared database:
- PostgreSQL for download tracking
- Redis for caching
- S3 for file storage

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check system resources
docker stats

# Rebuild
docker-compose -f docker-compose.prod.yml build --no-cache
```

### yt-dlp Errors
```bash
# Update yt-dlp
docker-compose -f docker-compose.prod.yml exec music-player pip3 install -U yt-dlp

# Test yt-dlp
docker-compose -f docker-compose.prod.yml exec music-player yt-dlp --version
```

### ngrok Not Working
```bash
# Check auth token
echo $NGROK_AUTHTOKEN

# View ngrok logs
docker-compose -f docker-compose.prod.yml exec music-player cat /app/logs/ngrok.log

# Restart ngrok
docker-compose -f docker-compose.prod.yml restart
```

### High Memory Usage
```bash
# Check memory
docker stats

# Limit memory
# Edit docker-compose.prod.yml:
services:
  music-player:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Port Already in Use
```bash
# Find process
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

## 📈 Performance Optimization

### 1. Enable Caching
Cache yt-dlp results for faster responses.

### 2. Use CDN
Serve static files via CDN.

### 3. Optimize Downloads
- Use quality parameter (lower = smaller files)
- Implement download queue
- Clean up old files regularly

### 4. Database Indexing
If using database, index frequently queried fields.

### 5. Compression
Enable gzip compression for API responses.

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Set strong `SECRET_KEY` and `JWT_SECRET`
- [ ] Configure CORS for your domain only
- [ ] Enable rate limiting
- [ ] Set up SSL/TLS (HTTPS)
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Enable automatic backups
- [ ] Test health checks
- [ ] Configure log rotation
- [ ] Set up error tracking (Sentry)
- [ ] Document deployment process
- [ ] Create rollback plan
- [ ] Test disaster recovery
- [ ] Enable security scanning
- [ ] Configure auto-scaling (if needed)

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [ngrok Documentation](https://ngrok.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🆘 Support

### Check Status
```bash
# Health check
curl http://localhost:3000/api/music/health

# System info
docker-compose -f docker-compose.prod.yml exec music-player node -v
docker-compose -f docker-compose.prod.yml exec music-player yt-dlp --version
```

### Get Help
- Check logs first
- Review this guide
- Check GitHub issues
- Contact support

---

**Production deployment is now complete! 🎉**

Everything runs with one command: `./start.sh --docker`
