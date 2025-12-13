# Music Player Backend API

Backend service for the music player app using yt-dlp for YouTube audio extraction.

## Features

- **YouTube Search**: Search for videos/music
- **Audio Extraction**: Get direct audio stream URLs
- **Video Information**: Fetch video metadata
- **Trending Music**: Get trending videos
- **Multiple Formats**: Support for various audio formats
- **Streaming**: Direct audio streaming

## Prerequisites

- Node.js (v16 or later)
- Python 3
- yt-dlp

## Installation

### 1. Install Node.js Dependencies

```bash
cd backend
npm install
```

### 2. Install yt-dlp

```bash
# On Linux/Mac
pip3 install -U yt-dlp

# Or using npm script
npm run install-ytdlp

# On Windows
pip install -U yt-dlp
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
NODE_ENV=development
YTDLP_PATH=/usr/local/bin/yt-dlp
CACHE_DIR=./cache
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Search Videos

```http
GET /api/music/search?query=<search_term>&limit=<number>
```

**Example:**
```bash
curl "http://localhost:3000/api/music/search?query=lofi%20music&limit=10"
```

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

### Get Trending Music

```http
GET /api/music/trending?region=<region_code>
```

**Example:**
```bash
curl "http://localhost:3000/api/music/trending?region=US"
```

### Get Video Information

```http
GET /api/music/video/:videoId
```

**Example:**
```bash
curl "http://localhost:3000/api/music/video/jfKfPfyJRdk"
```

### Get Audio Stream URL

```http
GET /api/music/audio/:videoId
```

**Example:**
```bash
curl "http://localhost:3000/api/music/audio/jfKfPfyJRdk"
```

**Response:**
```json
{
  "url": "https://rr1---sn-...",
  "videoId": "jfKfPfyJRdk"
}
```

### Get Audio Formats

```http
GET /api/music/formats/:videoId
```

### Stream Audio (Redirect)

```http
GET /api/music/stream/:videoId
```

### Health Check

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

## Architecture

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   └── musicController.js
│   ├── services/          # Business logic
│   │   └── ytdlpService.js
│   ├── routes/            # API routes
│   │   └── musicRoutes.js
│   ├── utils/             # Helper functions
│   └── index.js           # Main server file
├── cache/                 # Downloaded files cache
├── .env                   # Environment variables
├── .env.example           # Example env file
├── package.json
└── README.md
```

## Integration with React Native App

Update the frontend `YouTubeService.ts` to use this backend:

```typescript
const API_BASE = 'http://localhost:3000/api/music';

async search(query: string) {
  const response = await axios.get(`${API_BASE}/search`, {
    params: { query, limit: 20 }
  });
  return response.data.results;
}

async getAudioUrl(videoId: string) {
  const response = await axios.get(`${API_BASE}/audio/${videoId}`);
  return response.data.url;
}
```

## Deployment

### Docker Deployment

```dockerfile
FROM node:18-alpine

# Install Python and yt-dlp
RUN apk add --no-cache python3 py3-pip
RUN pip3 install -U yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

### Heroku Deployment

```bash
# Install buildpacks
heroku buildpacks:add --index 1 heroku/python
heroku buildpacks:add --index 2 heroku/nodejs

# Deploy
git push heroku main
```

## Troubleshooting

### yt-dlp not found

```bash
# Check if yt-dlp is installed
yt-dlp --version

# Install/update
pip3 install -U yt-dlp

# Update PATH in .env
YTDLP_PATH=/usr/local/bin/yt-dlp
```

### Permission Issues

```bash
# Make yt-dlp executable
chmod +x $(which yt-dlp)
```

### Slow Searches

- yt-dlp needs to fetch data from YouTube, which can be slow
- Consider implementing caching for frequent searches
- Use smaller limit values for faster responses

## Performance Tips

1. **Caching**: Cache search results and video info
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Queue System**: Use a queue for download requests
4. **CDN**: Cache audio streams with a CDN
5. **Async Operations**: All operations are async

## Security Considerations

1. **Input Validation**: Validate all user inputs
2. **Rate Limiting**: Prevent API abuse
3. **CORS**: Configure CORS appropriately
4. **Environment Variables**: Never commit .env file
5. **Error Handling**: Don't expose internal errors

## Development

### Adding New Features

1. Create service method in `ytdlpService.js`
2. Add controller method in `musicController.js`
3. Define route in `musicRoutes.js`
4. Test with curl or Postman

### Testing

```bash
# Test search
curl "http://localhost:3000/api/music/search?query=test"

# Test health
curl "http://localhost:3000/api/music/health"

# Test video info
curl "http://localhost:3000/api/music/video/jfKfPfyJRdk"
```

## Known Limitations

- YouTube may rate limit or block requests
- Audio URLs expire after some time
- Some videos may not be available in all regions
- Download speeds depend on YouTube servers

## Future Enhancements

- [ ] Redis caching for search results
- [ ] WebSocket support for real-time updates
- [ ] Download queue management
- [ ] Multiple quality options
- [ ] Playlist support
- [ ] Authentication/API keys
- [ ] Usage analytics
- [ ] Error logging (Sentry)

## License

MIT License
