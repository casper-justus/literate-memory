import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Track } from '../types/music';

class MediaNotificationService {
  private notificationId: string | null = null;

  async initialize() {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
    }

    // Enable background audio
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async showMediaNotification(
    track: Track,
    isPlaying: boolean,
    onPlayPause: () => void,
    onNext: () => void,
    onPrevious: () => void
  ) {
    try {
      // Cancel existing notification
      if (this.notificationId) {
        await Notifications.dismissNotificationAsync(this.notificationId);
      }

      // Create notification
      const notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: track.title,
          body: track.artist,
          data: {
            trackId: track.id,
            type: 'media',
          },
          sound: false,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          sticky: true,
          categoryIdentifier: 'media',
        },
        trigger: null, // Show immediately
      });

      this.notificationId = notification;

      // Setup action handlers
      this.setupActionHandlers(onPlayPause, onNext, onPrevious);
    } catch (error) {
      console.error('Error showing media notification:', error);
    }
  }

  private setupActionHandlers(
    onPlayPause: () => void,
    onNext: () => void,
    onPrevious: () => void
  ) {
    // Setup notification categories with actions
    Notifications.setNotificationCategoryAsync('media', [
      {
        identifier: 'previous',
        buttonTitle: '⏮',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'playPause',
        buttonTitle: '⏯',
        options: {
          opensAppToForeground: false,
        },
      },
      {
        identifier: 'next',
        buttonTitle: '⏭',
        options: {
          opensAppToForeground: false,
        },
      },
    ]);

    // Handle action responses
    Notifications.addNotificationResponseReceivedListener((response) => {
      const action = response.actionIdentifier;

      switch (action) {
        case 'previous':
          onPrevious();
          break;
        case 'playPause':
          onPlayPause();
          break;
        case 'next':
          onNext();
          break;
      }
    });
  }

  async updateNotification(track: Track, isPlaying: boolean) {
    // Update existing notification
    if (this.notificationId) {
      await Notifications.dismissNotificationAsync(this.notificationId);
    }

    // Create new notification with updated state
    // This is a simplified version - you'd typically update the existing one
    const notification = await Notifications.scheduleNotificationAsync({
      content: {
        title: track.title,
        body: `${track.artist} • ${isPlaying ? 'Playing' : 'Paused'}`,
        data: {
          trackId: track.id,
          isPlaying,
        },
        sound: false,
        sticky: true,
      },
      trigger: null,
    });

    this.notificationId = notification;
  }

  async hideNotification() {
    if (this.notificationId) {
      await Notifications.dismissNotificationAsync(this.notificationId);
      this.notificationId = null;
    }
  }

  async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
    this.notificationId = null;
  }
}

export default new MediaNotificationService();
