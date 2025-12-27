import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, BottomTabParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import MusicPlayerScreen from '../screens/MusicPlayerScreen';
import SearchScreen from '../screens/SearchScreen';
import PlaylistsScreen from '../screens/PlaylistsScreen';
import PlaylistDetailsScreen from '../screens/PlaylistDetailsScreen';
import YouTubePlaylistScreen from '../screens/YouTubePlaylistScreen';
import NowPlayingScreen from '../screens/NowPlayingScreen';
import LyricsScreen from '../screens/LyricsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MiniPlayer from '../components/MiniPlayer';
import { MusicPlayerProvider } from '../context/MusicPlayerContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabNavigator() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1A1A',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#333',
            paddingBottom: 5,
            height: 60,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 11,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MusicPlayer"
          component={MusicPlayerScreen}
          options={{
            title: 'Music',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Playlists"
          component={PlaylistsScreen}
          options={{
            title: 'Playlists',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size || 24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size || 24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <MusicPlayerProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1A1A1A',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ title: 'Details' }}
          />
          <Stack.Screen
            name="PlaylistDetails"
            component={PlaylistDetailsScreen}
            options={{ title: 'Playlist' }}
          />
          <Stack.Screen
            name="YouTubePlaylist"
            component={YouTubePlaylistScreen}
            options={{ title: 'YouTube Playlist' }}
          />
          <Stack.Screen
            name="NowPlaying"
            component={NowPlayingScreen}
            options={{
              title: 'Now Playing',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Lyrics"
            component={LyricsScreen}
            options={{
              title: 'Lyrics',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicPlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
