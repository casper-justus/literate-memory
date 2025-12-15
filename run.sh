#!/bin/bash

# Music Player App - Master Run Script
# Runs EVERYTHING with ONE command

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Banner
clear
echo -e "${MAGENTA}"
cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              🎵 MUSIC PLAYER - ONE COMMAND DEPLOY              ║
║                                                                ║
║         Frontend + Backend + yt-dlp + ngrok + Downloads        ║
║                    ALL IN ONE CONTAINER                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${CYAN}[✓]${NC} $1"; }

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed!"
    echo ""
    echo "Please install Docker first:"
    echo "  Ubuntu: sudo apt install docker.io docker-compose"
    echo "  Mac: brew install docker docker-compose"
    echo "  Or visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    error "docker-compose not found!"
    echo "Please install docker-compose: sudo apt install docker-compose"
    exit 1
fi

success "Docker is available"
echo ""

# Show options
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  What would you like to do?${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "  1) 🚀 Start Everything (Recommended)"
echo "  2) 🔨 Build Container"
echo "  3) ⏹️  Stop Everything"
echo "  4) 📊 View Status"
echo "  5) 📝 View Logs"
echo "  6) 🔄 Restart Services"
echo "  7) 🧹 Clean Up (Remove containers and volumes)"
echo "  8) 🌐 Setup ngrok"
echo "  9) 🔍 Health Check"
echo "  0) ❌ Exit"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

read -p "$(echo -e ${CYAN}Choose an option [1]: ${NC})" choice
choice=${choice:-1}

case $choice in
    1)
        log "🚀 Starting Music Player App..."
        echo ""
        
        # Check for ngrok token
        if [ -z "$NGROK_AUTHTOKEN" ]; then
            warn "NGROK_AUTHTOKEN not set"
            echo "   To enable public URL, set your ngrok token:"
            echo "   export NGROK_AUTHTOKEN=your_token_here"
            echo "   Get token from: https://dashboard.ngrok.com/get-started/your-authtoken"
            echo ""
            read -p "Continue without ngrok? [Y/n]: " continue_choice
            continue_choice=${continue_choice:-Y}
            if [[ ! $continue_choice =~ ^[Yy]$ ]]; then
                exit 0
            fi
        fi
        
        # Build if needed
        if ! docker images | grep -q "music-player-production"; then
            log "📦 Building container (first time)..."
            $COMPOSE_CMD -f docker-compose.prod.yml build
        fi
        
        # Start services
        log "🎵 Starting services..."
        $COMPOSE_CMD -f docker-compose.prod.yml up -d
        
        # Wait for health check
        log "⏳ Waiting for services to start..."
        sleep 10
        
        # Check health
        if curl -s http://localhost:3000/api/music/health > /dev/null 2>&1; then
            success "Backend is healthy!"
        else
            warn "Backend health check failed, but container is running"
        fi
        
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                                ║${NC}"
        echo -e "${GREEN}║              ✅ MUSIC PLAYER IS RUNNING!                       ║${NC}"
        echo -e "${GREEN}║                                                                ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}📊 Services:${NC}"
        echo "  • Backend API:     http://localhost:3000"
        echo "  • Health Check:    http://localhost:3000/api/music/health"
        echo "  • ngrok Dashboard: http://localhost:4040"
        echo ""
        
        # Get ngrok URL if available
        sleep 3
        NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -n1)
        if [ -n "$NGROK_URL" ]; then
            echo -e "${GREEN}🌐 Public URL:${NC} $NGROK_URL"
            echo ""
        fi
        
        echo -e "${CYAN}📚 Quick Commands:${NC}"
        echo "  • View logs:    $COMPOSE_CMD -f docker-compose.prod.yml logs -f"
        echo "  • Stop:         $COMPOSE_CMD -f docker-compose.prod.yml down"
        echo "  • Restart:      $COMPOSE_CMD -f docker-compose.prod.yml restart"
        echo ""
        echo -e "${CYAN}🎵 Try it:${NC}"
        echo "  curl \"http://localhost:3000/api/music/search?query=lofi&limit=5\""
        echo ""
        ;;
        
    2)
        log "🔨 Building container..."
        $COMPOSE_CMD -f docker-compose.prod.yml build --no-cache
        success "Build complete!"
        ;;
        
    3)
        log "⏹️  Stopping all services..."
        $COMPOSE_CMD -f docker-compose.prod.yml down
        success "All services stopped"
        ;;
        
    4)
        info "📊 Service Status:"
        echo ""
        $COMPOSE_CMD -f docker-compose.prod.yml ps
        echo ""
        
        if curl -s http://localhost:3000/api/music/health > /dev/null 2>&1; then
            success "Backend is healthy"
            curl -s http://localhost:3000/api/music/health | python3 -m json.tool 2>/dev/null || echo ""
        else
            warn "Backend is not responding"
        fi
        ;;
        
    5)
        info "📝 Showing logs (Ctrl+C to exit)..."
        $COMPOSE_CMD -f docker-compose.prod.yml logs -f
        ;;
        
    6)
        log "🔄 Restarting services..."
        $COMPOSE_CMD -f docker-compose.prod.yml restart
        success "Services restarted"
        ;;
        
    7)
        warn "This will remove all containers, volumes, and downloaded files!"
        read -p "Are you sure? [y/N]: " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            log "🧹 Cleaning up..."
            $COMPOSE_CMD -f docker-compose.prod.yml down -v
            success "Cleanup complete"
        else
            info "Cleanup cancelled"
        fi
        ;;
        
    8)
        echo ""
        echo -e "${CYAN}🌐 ngrok Setup${NC}"
        echo ""
        echo "1. Sign up at: https://dashboard.ngrok.com/signup"
        echo "2. Get your token: https://dashboard.ngrok.com/get-started/your-authtoken"
        echo "3. Set environment variable:"
        echo ""
        echo "   export NGROK_AUTHTOKEN=your_token_here"
        echo ""
        echo "4. Restart the application:"
        echo "   ./run.sh"
        echo ""
        ;;
        
    9)
        info "🔍 Running health checks..."
        echo ""
        
        # Check container
        if docker ps | grep -q "music-player-production"; then
            success "Container is running"
        else
            error "Container is not running"
            exit 1
        fi
        
        # Check backend
        if curl -s http://localhost:3000/api/music/health > /dev/null 2>&1; then
            success "Backend is healthy"
            curl -s http://localhost:3000/api/music/health | python3 -m json.tool 2>/dev/null
        else
            error "Backend is not responding"
        fi
        
        echo ""
        ;;
        
    0)
        info "Goodbye!"
        exit 0
        ;;
        
    *)
        error "Invalid option"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Run './run.sh' anytime to manage your app${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
