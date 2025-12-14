#!/bin/bash

# Music Player App - Ubuntu Installation Script
# This script installs all dependencies needed for the project

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🎵 Music Player App - Ubuntu Installation             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root (without sudo)"
    exit 1
fi

echo "📦 Starting installation process..."
echo ""

# Update system
echo "1️⃣  Updating system packages..."
sudo apt update -y > /dev/null 2>&1 && print_status "System updated" || print_error "Failed to update system"
echo ""

# Install curl and git
echo "2️⃣  Installing curl and git..."
sudo apt install -y curl git > /dev/null 2>&1 && print_status "curl and git installed" || print_error "Failed to install curl/git"
echo ""

# Install Node.js
echo "3️⃣  Installing Node.js 20.x..."
if command -v node &> /dev/null; then
    print_warning "Node.js already installed: $(node --version)"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1
    sudo apt install -y nodejs > /dev/null 2>&1 && print_status "Node.js installed: $(node --version)" || print_error "Failed to install Node.js"
fi
echo ""

# Install Python3 and pip3
echo "4️⃣  Installing Python3 and pip3..."
sudo apt install -y python3 python3-pip > /dev/null 2>&1 && print_status "Python3 installed: $(python3 --version)" || print_error "Failed to install Python3"
echo ""

# Install yt-dlp
echo "5️⃣  Installing yt-dlp..."
pip3 install -U yt-dlp > /dev/null 2>&1 && print_status "yt-dlp installed" || print_error "Failed to install yt-dlp"
echo ""

# Install build tools
echo "6️⃣  Installing build essentials..."
sudo apt install -y build-essential > /dev/null 2>&1 && print_status "Build tools installed" || print_error "Failed to install build tools"
echo ""

# Install FFmpeg
echo "7️⃣  Installing FFmpeg..."
sudo apt install -y ffmpeg > /dev/null 2>&1 && print_status "FFmpeg installed" || print_error "Failed to install FFmpeg"
echo ""

# Install Expo CLI
echo "8️⃣  Installing Expo CLI..."
npm install -g @expo/cli > /dev/null 2>&1 && print_status "Expo CLI installed" || print_error "Failed to install Expo CLI"
echo ""

# Install LocalTunnel
echo "9️⃣  Installing LocalTunnel..."
npm install -g localtunnel > /dev/null 2>&1 && print_status "LocalTunnel installed" || print_error "Failed to install LocalTunnel"
echo ""

# Add local bin to PATH
echo "🔟 Configuring PATH..."
if ! grep -q '$HOME/.local/bin' ~/.bashrc; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
    print_status "PATH configured"
else
    print_warning "PATH already configured"
fi
export PATH="$HOME/.local/bin:$PATH"
echo ""

# Install project dependencies
echo "1️⃣1️⃣ Installing project dependencies..."

if [ -f "package.json" ]; then
    echo "   Installing frontend dependencies..."
    npm install > /dev/null 2>&1 && print_status "Frontend dependencies installed" || print_warning "Check npm install output"
else
    print_warning "package.json not found in current directory"
fi

if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "   Installing backend dependencies..."
    cd backend
    npm install > /dev/null 2>&1 && print_status "Backend dependencies installed" || print_warning "Check backend npm install output"
    cd ..
else
    print_warning "backend directory not found"
fi
echo ""

# Verification
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ VERIFICATION                            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    print_status "Node.js: $(node --version)"
else
    print_error "Node.js: Not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    print_status "npm: $(npm --version)"
else
    print_error "npm: Not found"
fi

# Check Python3
if command -v python3 &> /dev/null; then
    print_status "Python3: $(python3 --version)"
else
    print_error "Python3: Not found"
fi

# Check pip3
if command -v pip3 &> /dev/null; then
    print_status "pip3: $(pip3 --version | cut -d' ' -f2)"
else
    print_error "pip3: Not found"
fi

# Check yt-dlp
if command -v yt-dlp &> /dev/null; then
    print_status "yt-dlp: $(yt-dlp --version)"
else
    print_error "yt-dlp: Not found"
fi

# Check Expo CLI
if command -v expo &> /dev/null; then
    print_status "Expo CLI: Installed"
else
    print_warning "Expo CLI: Not found (may need to reload shell)"
fi

# Check git
if command -v git &> /dev/null; then
    print_status "git: $(git --version | cut -d' ' -f3)"
else
    print_error "git: Not found"
fi

# Check FFmpeg
if command -v ffmpeg &> /dev/null; then
    print_status "FFmpeg: Installed"
else
    print_warning "FFmpeg: Not found"
fi

# Check LocalTunnel
if command -v lt &> /dev/null; then
    print_status "LocalTunnel: Installed"
else
    print_warning "LocalTunnel: Not found (may need to reload shell)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 INSTALLATION COMPLETE!                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Reload your shell configuration:"
echo "   source ~/.bashrc"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm start"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   npm start"
echo ""
echo "4. (Optional) Create a public tunnel:"
echo "   lt --port 3000"
echo ""
echo "📚 Documentation:"
echo "   • UBUNTU_INSTALLATION.md - Full installation guide"
echo "   • QUICK_START.md - Quick start guide"
echo "   • README.md - Project documentation"
echo ""
echo "🎵 Happy coding! Your music player is ready to go!"
echo ""
