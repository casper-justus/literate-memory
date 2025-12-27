# React Native Expo App

A cross-platform mobile application built with React Native and Expo, featuring Android native support.

## Features

- ✅ TypeScript support
- ✅ React Navigation (Stack Navigation)
- ✅ Custom reusable components (Button, Card, Input, LoadingSpinner)
- ✅ Custom hooks (useStorage, useFetch)
- ✅ Utility functions (formatters, validators)
- ✅ AsyncStorage for local data persistence
- ✅ Android native build support
- ✅ Modern UI with proper styling

## Tech Stack

- **React Native** 0.81.5
- **Expo** ~54.0
- **TypeScript** ~5.9
- **React Navigation** (Stack & Bottom Tabs)
- **AsyncStorage** for local storage
- **React Native Gesture Handler** for native gestures

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useFetch.ts
│   │   └── useStorage.ts
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── DetailsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── navigation.ts
│   └── utils/            # Utility functions
│       ├── formatters.ts
│       └── validators.ts
├── assets/               # Static assets (images, fonts)
├── App.tsx              # Root component
├── app.json             # Expo configuration
└── package.json         # Dependencies

```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Android device or emulator

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the App

#### Development Mode

Start the Expo development server:

```bash
npm start
```

#### Android

Run on Android device/emulator:

```bash
npm run android
```

#### iOS (macOS only)

Run on iOS device/simulator:

```bash
npm run ios
```

#### Web

Run in web browser:

```bash
npm run web
```

## Building for Production

### Android APK/AAB

1. Configure EAS Build (if not already done):

```bash
npm install -g eas-cli
eas login
eas build:configure
```

2. Build for Android:

```bash
eas build --platform android
```

## App Features

### Home Screen
- Displays a list of items
- Navigation to detail screens
- Profile access
- Persistent user data with AsyncStorage

### Details Screen
- Shows item details
- Add and save notes
- Dynamic navigation parameters

### Profile Screen
- Edit user profile (username, email, bio)
- Form validation
- Data persistence
- Reset functionality

## Components

### Button
Customizable button component with loading states and variants (primary, secondary, danger).

### Card
Container component with shadow and elevation for displaying grouped content.

### Input
Text input component with label, error handling, and validation support.

### LoadingSpinner
Loading indicator with optional message display.

## Custom Hooks

### useStorage
Hook for managing AsyncStorage with automatic serialization and loading states.

### useFetch
Hook for handling API requests with loading, error states, and refetch functionality.

## Utilities

### Formatters
- Date formatting
- Currency formatting
- String capitalization
- Text truncation

### Validators
- Email validation
- Phone number validation
- URL validation
- Password strength checking

## Configuration

### Android Configuration
The `app.json` file includes Android-specific settings:
- Package name: `com.reactnativeexpoapp`
- Permissions: Internet access, Network state
- Adaptive icon configuration
- Edge-to-edge display support

### TypeScript Configuration
Strict mode enabled for better type safety and code quality.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
