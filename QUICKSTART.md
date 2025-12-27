# Quick Start Guide

Get up and running with the React Native Expo App in minutes!

## Installation

```bash
# Install dependencies
npm install
```

## Running the App

### Option 1: Expo Go (Easiest)

1. Install "Expo Go" app on your phone from:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with:
   - Android: Expo Go app
   - iOS: Camera app (will open in Expo Go)

### Option 2: Android Emulator

1. Install and setup Android Studio
2. Create an Android Virtual Device (AVD)
3. Start the emulator
4. Run:
   ```bash
   npm run android
   ```

### Option 3: Web Browser

```bash
npm run web
```

## Project Structure

```
src/
├── components/     → Reusable UI components
├── hooks/         → Custom React hooks
├── navigation/    → Navigation setup
├── screens/       → Screen components
├── types/         → TypeScript definitions
└── utils/         → Helper functions
```

## Key Features

### Navigation
The app uses React Navigation with three main screens:
- **Home**: List view with navigation to details
- **Details**: Individual item view with note-taking
- **Profile**: User profile management

### Components
Pre-built components ready to use:
```typescript
import { Button, Card, Input, LoadingSpinner } from './src/components';
```

### Custom Hooks
```typescript
// For local storage
import { useStorage } from './src/hooks/useStorage';
const { storedValue, setValue } = useStorage('key', defaultValue);

// For API calls
import { useFetch } from './src/hooks/useFetch';
const { data, loading, error, refetch } = useFetch(url);
```

### Utilities
```typescript
// Formatters
import { formatDate, formatCurrency, capitalize, truncate } from './src/utils/formatters';

// Validators
import { isValidEmail, isValidPhone, isValidUrl, isStrongPassword } from './src/utils/validators';
```

## Common Tasks

### Add a New Screen

1. Create screen file in `src/screens/`:
```typescript
// src/screens/NewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

2. Add route type in `src/types/navigation.ts`:
```typescript
export type RootStackParamList = {
  // ... existing routes
  NewScreen: undefined;
};
```

3. Add to navigator in `src/navigation/AppNavigator.tsx`:
```typescript
<Stack.Screen 
  name="NewScreen" 
  component={NewScreen}
  options={{ title: 'New Screen' }}
/>
```

### Add a New Component

Create in `src/components/` and export from `index.ts`:
```typescript
// src/components/MyComponent.tsx
export default function MyComponent() {
  // component code
}

// src/components/index.ts
export { default as MyComponent } from './MyComponent';
```

## Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### iOS Issues (macOS only)
```bash
cd ios
pod install
cd ..
npm run ios
```

## Next Steps

- Read the [full README](README.md) for detailed information
- Check [Android Build Guide](ANDROID_BUILD.md) for production builds
- Review [Contributing Guidelines](CONTRIBUTING.md) to contribute
- See [CHANGELOG](CHANGELOG.md) for version history

## Need Help?

- Check the [Expo documentation](https://docs.expo.dev/)
- Visit [React Native docs](https://reactnative.dev/)
- Browse [React Navigation docs](https://reactnavigation.org/)

Happy coding! 🚀
