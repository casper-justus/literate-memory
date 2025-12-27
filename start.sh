#!/bin/bash

# Music Player App - One Command Startup Script
# This script starts the entire application with one command

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🎵 Music Player App - One Command Startup             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if running with Docker
USE_DOCKER=false
if command -v docker &> /dev/null && [ "$1" == "--docker" ]; then
    USE_DOCKER=true
fi

if [ "$USE_DOCKER" = true ]; then
    log "🐳 Starting with Docker..."
    
    # Check if docker-compose is available
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        error "docker-compose not found. Please install it."
        exit 1
    fi
    
    # Build and start with docker-compose
    log "📦 Building Docker image..."
    $COMPOSE_CMD -f docker-compose.prod.yml build
    
    log "🚀 Starting containers..."
    $COMPOSE_CMD -f docker-compose.prod.yml up -d
    
    log "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check health
    if curl -s http://localhost:3000/api/music/health > /dev/null; then
        log "✅ Backend is healthy!"
    else
        warn "Backend health check failed"
    fi
    
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ✅ Application Started Successfully!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Services:"
    echo "  • Backend API: http://localhost:3000"
    echo "  • Health Check: http://localhost:3000/api/music/health"
    echo "  • ngrok Dashboard: http://localhost:4040"
    echo ""
    echo "📚 View logs:"
    echo "  $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
    echo ""
    echo "🛑 Stop application:"
    echo "  $COMPOSE_CMD -f docker-compose.prod.yml down"
    echo ""
    
else
    log "💻 Starting in local mode..."
    
    # Check dependencies
    info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v yt-dlp &> /dev/null; then
        warn "yt-dlp not found. Attempting to install..."
        pip3 install --break-system-packages -U yt-dlp || pip3 install -U yt-dlp
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log "📦 Installing frontend dependencies..."
        npm install
    fi
    
    if [ ! -d "backend/node_modules" ]; then
        log "📦 Installing backend dependencies..."
        cd backend && npm install && cd ..
    fi
    
    # Create necessary directories
    mkdir -p backend/cache backend/downloads logs
    
    # Start backend
    log "🎵 Starting backend server..."
    cd backend
    node src/index.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    log "⏳ Waiting for backend to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/api/music/health > /dev/null 2>&1; then
            log "✅ Backend is ready!"
            break
        fi
        sleep 1
    done
    
    # Start ngrok if auth token is set
    if [ -n "$NGROK_AUTHTOKEN" ]; then
        log "🌐 Starting ngrok tunnel..."
        if command -v ngrok &> /dev/null; then
            ngrok config add-authtoken $NGROK_AUTHTOKEN
            ngrok http 3000 > logs/ngrok.log 2>&1 &
            NGROK_PID=$!
            sleep 3
            
            NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n1)
            if [ -n "$NGROK_URL" ]; then
                log "✅ Public URL: $NGROK_URL"
                echo "$NGROK_URL" > logs/ngrok_url.txt
            fi
        else
            warn "ngrok not found. Install with: npm install -g localtunnel"
        fi
    fi
    
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ✅ Application Started Successfully!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Services:"
    echo "  • Backend API: http://localhost:3000"
    echo "  • Backend PID: $BACKEND_PID"
    
    if [ -n "$NGROK_URL" ]; then
        echo "  • Public URL: $NGROK_URL"
        echo "  • ngrok Dashboard: http://localhost:4040"
    fi
    
    echo ""
    echo "📝 Logs:"
    echo "  • Backend: tail -f logs/backend.log"
    echo "  • ngrok: tail -f logs/ngrok.log"
    echo ""
    echo "🛑 Stop:"
    echo "  kill $BACKEND_PID"
    [ -n "$NGROK_PID" ] && echo "  kill $NGROK_PID"
    echo ""
    
    # Save PIDs
    echo "$BACKEND_PID" > logs/backend.pid
    [ -n "$NGROK_PID" ] && echo "$NGROK_PID" > logs/ngrok.pid
fi

echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎉 Ready to use! Enjoy your music player!"
echo ""
