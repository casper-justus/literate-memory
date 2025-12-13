# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-13

### Added
- Initial Expo project setup with TypeScript support
- React Navigation with Stack Navigator
- Home screen with item list and navigation
- Details screen with note-taking functionality
- Profile screen with user data management
- Custom reusable components:
  - Button component with variants and loading states
  - Card component for content grouping
  - Input component with validation support
  - LoadingSpinner component
- Custom hooks:
  - useStorage for AsyncStorage management
  - useFetch for API data fetching
- Utility functions:
  - Formatters (date, currency, string)
  - Validators (email, phone, URL, password)
- Android native support configuration
- EAS Build configuration
- Comprehensive documentation (README, CONTRIBUTING, ANDROID_BUILD)
- TypeScript strict mode enabled
- Proper project structure with src directory organization

### Configuration
- Android package: com.reactnativeexpoapp
- iOS bundle identifier: com.reactnativeexpoapp
- Expo SDK ~54.0
- React Native 0.81.5
- TypeScript ~5.9

### Dependencies
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs
- @react-native-async-storage/async-storage
- react-native-gesture-handler
- react-native-safe-area-context
- react-native-screens
- expo-status-bar

## [Unreleased]

### Planned
- Add more screen examples
- Implement API integration
- Add unit tests
- Add E2E tests
- Implement state management (Context API or Redux)
- Add dark mode support
- Add internationalization (i18n)
- Add offline support
- Add push notifications
