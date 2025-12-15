# Multi-stage Dockerfile for Music Player App
# Combines frontend (Expo web) and backend (Node.js + yt-dlp)

FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    bash \
    curl \
    git \
    openssh-client

# Install yt-dlp
RUN pip3 install --no-cache-dir --break-system-packages -U yt-dlp

# Install ngrok
RUN wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz && \
    tar -xvzf ngrok-v3-stable-linux-amd64.tgz && \
    mv ngrok /usr/local/bin/ngrok && \
    rm ngrok-v3-stable-linux-amd64.tgz && \
    chmod +x /usr/local/bin/ngrok

# Set working directory
WORKDIR /app

# Copy package files for both frontend and backend
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && \
    cd backend && npm ci --only=production && cd ..

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/backend/cache /app/backend/downloads /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV EXPO_WEB_PORT=19006
ENV YTDLP_PATH=/usr/local/bin/yt-dlp

# Expose ports
EXPOSE 3000 19006 4040

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/music/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Start application
CMD ["/start.sh"]
