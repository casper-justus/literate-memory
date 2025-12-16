#!/bin/bash

# Complete Setup Script - Music Player with Visualizer and Web Support
# Sets up everything you need in ONE command

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
║        🎵 MUSIC PLAYER - COMPLETE SETUP 🎵                    ║
║                                                                ║
║   ✅ Mobile (Android/iOS)                                     ║
║   ✅ Web (Desktop/Mobile browsers)                            ║
║   ✅ Audio Visualizer                                         ║
║   ✅ Backend API (yt-dlp)                                     ║
║   ✅ Docker Support                                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${CYAN}[✓]${NC} $1"; }

# Check Node.js
log "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    error "Node.js is not installed!"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
success "Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed!"
    exit 1
fi
success "npm $(npm -v) found"

# Install frontend dependencies
log "Installing frontend dependencies..."
npm install
success "Frontend dependencies installed"

# Install backend dependencies
log "Installing backend dependencies..."
cd backend
npm install
cd ..
success "Backend dependencies installed"

# Check for Expo CLI
if ! command -v expo &> /dev/null; then
    log "Installing Expo CLI..."
    npm install -g expo-cli
    success "Expo CLI installed"
else
    success "Expo CLI already installed"
fi

# Setup complete
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║              ✅ SETUP COMPLETE!                                ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}🚀 Quick Start Commands:${NC}"
echo ""
echo -e "${YELLOW}Mobile App:${NC}"
echo "  npm run android         # Start on Android"
echo "  npm run ios             # Start on iOS"
echo ""
echo -e "${YELLOW}Web App:${NC}"
echo "  npm run web             # Start web version"
echo "  npm run build:web       # Build for production"
echo "  npm run serve:web       # Serve built version"
echo ""
echo -e "${YELLOW}Backend API:${NC}"
echo "  ./run.sh                # Interactive menu"
echo "  cd backend && npm start # Start backend only"
echo ""
echo -e "${YELLOW}Everything Together:${NC}"
echo "  docker-compose -f docker-compose.prod.yml up"
echo ""

echo -e "${CYAN}📚 Documentation:${NC}"
echo "  README_ONE_COMMAND.md         # One-command deploy"
echo "  MOBILE_ENHANCEMENTS.md        # Mobile features"
echo "  WEB_AND_VISUALIZER_GUIDE.md   # Web & visualizer"
echo "  PRODUCTION_GUIDE.md           # Production deployment"
echo ""

echo -e "${CYAN}🎨 Features:${NC}"
echo "  ✅ Audio Visualizer (4 types)"
echo "  ✅ Web Platform (PWA)"
echo "  ✅ Media Notifications"
echo "  ✅ Background Playback"
echo "  ✅ Offline Caching"
echo "  ✅ Lyrics Support"
echo "  ✅ Dynamic Theming"
echo "  ✅ Download Support"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Run 'npm run web' to start the web version now!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
