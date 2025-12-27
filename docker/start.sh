#!/bin/bash

set -e

echo "════════════════════════════════════════════════════════════"
echo "  🎵 Music Player App - Production Container Starting"
echo "════════════════════════════════════════════════════════════"
echo ""

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Cleanup function
cleanup() {
    log "⚠️  Shutting down services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Create necessary directories
mkdir -p /app/backend/cache /app/backend/downloads /app/logs

# Verify yt-dlp installation
log "📹 Verifying yt-dlp..."
if command -v yt-dlp &> /dev/null; then
    log "✓ yt-dlp version: $(yt-dlp --version)"
else
    log "❌ yt-dlp not found!"
    exit 1
fi

# Start ngrok if auth token is provided
if [ -n "$NGROK_AUTHTOKEN" ]; then
    log "🌐 Configuring ngrok..."
    ngrok config add-authtoken $NGROK_AUTHTOKEN
    log "🚀 Starting ngrok tunnel on port 3000..."
    ngrok http 3000 --log=stdout > /app/logs/ngrok.log 2>&1 &
    NGROK_PID=$!
    log "✓ ngrok started (PID: $NGROK_PID)"
    sleep 5
    
    # Try to get ngrok URL
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n1)
    if [ -n "$NGROK_URL" ]; then
        log "✓ Public URL: $NGROK_URL"
        echo "$NGROK_URL" > /app/logs/ngrok_url.txt
    fi
else
    log "⚠️  NGROK_AUTHTOKEN not set, skipping ngrok setup"
fi

# Start backend server
log "🎵 Starting backend server..."
cd /app/backend
node src/index.js > /app/logs/backend.log 2>&1 &
BACKEND_PID=$!
log "✓ Backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
log "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/music/health > /dev/null 2>&1; then
        log "✓ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        log "❌ Backend failed to start"
        exit 1
    fi
    sleep 1
done

# Display startup information
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ All Services Started Successfully!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📊 Service Status:"
echo "  • Backend API: http://localhost:3000"
echo "  • Health Check: http://localhost:3000/api/music/health"

if [ -n "$NGROK_AUTHTOKEN" ] && [ -n "$NGROK_URL" ]; then
    echo "  • Public URL: $NGROK_URL"
    echo "  • ngrok Dashboard: http://localhost:4040"
fi

echo ""
echo "📚 Documentation: /app/README.md"
echo "📝 Logs Directory: /app/logs/"
echo ""
echo "🎵 Music Player is ready! Press Ctrl+C to stop."
echo "════════════════════════════════════════════════════════════"
echo ""

# Monitor services
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        log "❌ Backend process died, restarting..."
        cd /app/backend
        node src/index.js > /app/logs/backend.log 2>&1 &
        BACKEND_PID=$!
    fi
    
    # Check if ngrok is still running (if started)
    if [ -n "$NGROK_AUTHTOKEN" ] && [ -n "$NGROK_PID" ]; then
        if ! kill -0 $NGROK_PID 2>/dev/null; then
            log "❌ ngrok process died, restarting..."
            ngrok http 3000 --log=stdout > /app/logs/ngrok.log 2>&1 &
            NGROK_PID=$!
        fi
    fi
    
    sleep 10
done
