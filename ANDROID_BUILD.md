# Android Build Guide

This document provides instructions for building and running the React Native Expo app on Android.

## Prerequisites

### Required Software
- Node.js (v16 or later)
- npm or yarn
- Android Studio (latest version)
- Android SDK
- Java Development Kit (JDK) 11 or later

### Android Studio Setup
1. Install Android Studio from https://developer.android.com/studio
2. Open Android Studio and install the Android SDK
3. Install Android SDK Build-Tools
4. Install Android Emulator (or connect a physical device)

### Environment Variables
Add the following to your `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

## Development Build

### Using Expo Go (Recommended for Development)
1. Install Expo Go app on your Android device from Google Play Store
2. Start the development server:
   ```bash
   npm start
   ```
3. Scan the QR code with the Expo Go app

### Using Android Emulator
1. Create an Android Virtual Device (AVD) in Android Studio
2. Start the emulator
3. Run the app:
   ```bash
   npm run android
   ```

## Production Build

### Using EAS Build (Recommended)

#### Initial Setup
1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure the project:
   ```bash
   eas build:configure
   ```

#### Building APK (for testing)
```bash
eas build --platform android --profile preview
```

#### Building AAB (for Google Play Store)
```bash
eas build --platform android --profile production
```

### Local Android Build (Alternative)

1. Generate native Android folder:
   ```bash
   expo prebuild --platform android
   ```

2. Build the APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## Android Configuration

### App Permissions
The app requests the following permissions (configured in `app.json`):
- `INTERNET` - For network requests
- `ACCESS_NETWORK_STATE` - For checking network connectivity

### Package Name
- Android package: `com.reactnativeexpoapp`

### Build Configuration
The build configuration is defined in `eas.json`:
- **development**: Development client build
- **preview**: APK for internal testing
- **production**: AAB for Google Play Store

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear
```

#### 2. Android Build Fails
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
expo prebuild --clean
```

#### 3. SDK License Issues
```bash
# Accept Android SDK licenses
$ANDROID_HOME/tools/bin/sdkmanager --licenses
```

#### 4. Device Not Detected
```bash
# Check connected devices
adb devices

# Restart ADB server
adb kill-server
adb start-server
```

### Debug Build
To test the app in debug mode:
```bash
expo run:android
```

### Check App Version
Current version: 1.0.0 (defined in app.json)

## Testing on Physical Device

### Enable Developer Options
1. Go to Settings > About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings > Developer Options
4. Enable "USB Debugging"

### Connect Device
1. Connect your Android device via USB
2. Verify connection: `adb devices`
3. Run the app: `npm run android`

## Release Checklist

Before releasing to production:

- [ ] Update version number in `app.json`
- [ ] Test all features on multiple Android versions
- [ ] Test on different screen sizes
- [ ] Verify all permissions are necessary
- [ ] Update app icons and splash screen
- [ ] Run production build locally
- [ ] Test the production build thoroughly
- [ ] Update CHANGELOG.md
- [ ] Create git tag for version

## Additional Resources

- [Expo Android Builds](https://docs.expo.dev/build/setup/)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Android Developer Guide](https://developer.android.com/guide)
