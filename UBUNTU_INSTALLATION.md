# Ubuntu Installation Guide - Complete Dependencies

Complete installation guide for setting up the Music Player project on Ubuntu.

## 📋 System Requirements

- Ubuntu 20.04 LTS or later
- At least 4GB RAM
- 10GB free disk space
- Internet connection

---

## 🔧 Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

---

## 📦 Step 2: Install Node.js and npm

### Option A: Using NodeSource Repository (Recommended - Latest LTS)

```bash
# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Option B: Using Ubuntu Default Repository (Older Version)

```bash
sudo apt install -y nodejs npm
node --version
npm --version
```

### Option C: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

---

## 🐍 Step 3: Install Python3 and pip

```bash
# Install Python3 and pip3
sudo apt install -y python3 python3-pip

# Verify installation
python3 --version
pip3 --version
```

---

## 📹 Step 4: Install yt-dlp

```bash
# Install yt-dlp using pip3
pip3 install -U yt-dlp

# Add to PATH (if needed)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
yt-dlp --version
```

### Alternative: Install yt-dlp using apt (Ubuntu 22.04+)

```bash
sudo apt install -y yt-dlp
yt-dlp --version
```

---

## 🔨 Step 5: Install Build Essentials

```bash
# Required for compiling native modules
sudo apt install -y build-essential

# Verify
gcc --version
make --version
```

---

## 📱 Step 6: Install Git

```bash
sudo apt install -y git

# Configure git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify
git --version
```

---

## 🚀 Step 7: Install Expo CLI (Global)

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Or use the latest method
npm install -g @expo/cli

# Verify
expo --version
```

---

## 🎵 Step 8: Install Project Dependencies

### Clone or Navigate to Project

```bash
# If cloning from git
git clone <your-repo-url>
cd react-native-expo-app

# Or just navigate to your project
cd /path/to/your/project
```

### Install Frontend Dependencies

```bash
# In project root
npm install

# This installs all dependencies from package.json including:
# - expo
# - react
# - react-native
# - @react-navigation packages
# - expo-av
# - expo-file-system
# - @react-native-async-storage/async-storage
# - axios
# - And all other dependencies
```

### Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# This installs:
# - express
# - cors
# - dotenv
# - axios

# Go back to project root
cd ..
```

---

## 🌐 Step 9: Install LocalTunnel (Optional - For Public URL)

```bash
# Install localtunnel globally
npm install -g localtunnel

# Verify
lt --version
```

---

## 📱 Step 10: Install Android Development Tools (Optional)

### For Android App Development

```bash
# Install Java Development Kit (JDK)
sudo apt install -y openjdk-17-jdk

# Verify Java installation
java -version

# Download Android Studio from https://developer.android.com/studio
# Or install via snap:
sudo snap install android-studio --classic

# After installation, set up Android SDK through Android Studio
```

### Add Android SDK to PATH

Add to `~/.bashrc`:

```bash
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

---

## 🔧 Step 11: Install Additional Useful Tools

### Install Watchman (For React Native)

```bash
# Install dependencies
sudo apt install -y autoconf automake build-essential python3-dev libssl-dev libtool pkg-config

# Clone and build watchman
cd /tmp
git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v2024.01.22.00
./autogen.sh
./configure
make
sudo make install

# Verify
watchman --version
```

### Install FFmpeg (For Media Processing)

```bash
sudo apt install -y ffmpeg
ffmpeg -version
```

### Install cURL (If Not Installed)

```bash
sudo apt install -y curl
curl --version
```

---

## ✅ Step 12: Verify All Installations

Run this verification script:

```bash
cat > verify_install.sh << 'EOF'
#!/bin/bash

echo "=== Verification Script ==="
echo ""

echo "1. Node.js:"
node --version || echo "❌ Node.js not found"
echo ""

echo "2. npm:"
npm --version || echo "❌ npm not found"
echo ""

echo "3. Python3:"
python3 --version || echo "❌ Python3 not found"
echo ""

echo "4. pip3:"
pip3 --version || echo "❌ pip3 not found"
echo ""

echo "5. yt-dlp:"
yt-dlp --version || echo "❌ yt-dlp not found"
echo ""

echo "6. Git:"
git --version || echo "❌ Git not found"
echo ""

echo "7. Expo CLI:"
expo --version || npx expo --version || echo "❌ Expo CLI not found"
echo ""

echo "8. Build tools:"
gcc --version | head -n1 || echo "❌ GCC not found"
make --version | head -n1 || echo "❌ Make not found"
echo ""

echo "9. Java (optional):"
java -version 2>&1 | head -n1 || echo "⚠️  Java not found (optional for Android)"
echo ""

echo "10. FFmpeg (optional):"
ffmpeg -version 2>&1 | head -n1 || echo "⚠️  FFmpeg not found (optional)"
echo ""

echo "=== Verification Complete ==="
EOF

chmod +x verify_install.sh
./verify_install.sh
```

---

## 🚀 Step 13: Initial Project Setup

```bash
# Navigate to project root
cd /home/engine/project

# Install all frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Verify TypeScript compilation
npm run type-check
```

---

## 🎵 Step 14: Configure and Start Backend

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env if needed (it should already be configured)
nano .env

# Start backend server
npm start
```

In another terminal:

```bash
# Verify backend is running
curl http://localhost:3000/api/music/health
```

---

## 📱 Step 15: Start Frontend

```bash
# In project root
npm start

# Or directly start on Android
npm run android

# Or on iOS (macOS only)
npm run ios

# Or on web
npm run web
```

---

## 🌐 Step 16: Setup Public Tunnel (Optional)

```bash
# Start localtunnel
lt --port 3000

# Note the URL provided and use it in your React Native app
```

---

## 📦 Quick Install Script

Here's a complete installation script for Ubuntu:

```bash
#!/bin/bash

# Save this as install_all.sh and run with: bash install_all.sh

echo "🚀 Installing all dependencies for Music Player App..."

# Update system
echo "📦 Updating system..."
sudo apt update -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python and pip
echo "🐍 Installing Python3 and pip3..."
sudo apt install -y python3 python3-pip

# Install yt-dlp
echo "📹 Installing yt-dlp..."
pip3 install -U yt-dlp

# Install build tools
echo "🔨 Installing build tools..."
sudo apt install -y build-essential git curl

# Install FFmpeg
echo "🎬 Installing FFmpeg..."
sudo apt install -y ffmpeg

# Install Expo CLI
echo "📱 Installing Expo CLI..."
npm install -g @expo/cli

# Install LocalTunnel
echo "🌐 Installing LocalTunnel..."
npm install -g localtunnel

# Add local bin to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo "✅ Base installations complete!"
echo ""
echo "Now run:"
echo "  cd /path/to/your/project"
echo "  npm install          # Install frontend dependencies"
echo "  cd backend && npm install  # Install backend dependencies"
```

---

## 🔍 Troubleshooting

### Issue: "command not found" after installation

**Solution:**
```bash
# Reload shell configuration
source ~/.bashrc
# or
source ~/.profile
```

### Issue: Permission denied errors

**Solution:**
```bash
# Don't use sudo with npm install in project
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Issue: yt-dlp not found

**Solution:**
```bash
# Install with --break-system-packages flag
pip3 install --break-system-packages -U yt-dlp

# Or add to PATH manually
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=3001
```

---

## 📊 Installation Summary

After running all commands, you should have:

- ✅ Node.js v20.x (or latest LTS)
- ✅ npm v10.x (or latest)
- ✅ Python 3.x
- ✅ pip3
- ✅ yt-dlp (latest version)
- ✅ Expo CLI
- ✅ Build tools (gcc, make)
- ✅ Git
- ✅ FFmpeg
- ✅ LocalTunnel
- ✅ All project dependencies

---

## 🎯 Next Steps

1. **Verify installations**: Run the verification script above
2. **Install project dependencies**: `npm install` in project root
3. **Install backend dependencies**: `cd backend && npm install`
4. **Start backend**: `cd backend && npm start`
5. **Start frontend**: `npm start` (in project root)
6. **Optional**: Setup tunnel for public access

---

## 📚 Additional Resources

- [Node.js Official Docs](https://nodejs.org/)
- [npm Documentation](https://docs.npmjs.com/)
- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

---

**Installation complete! Your Ubuntu system is ready for development!** 🎉
