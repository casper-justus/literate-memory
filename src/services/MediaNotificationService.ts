import * as Notifications from 'expo-notifications';
import { Track } from '../types/music';

class MediaNotificationService {
  private notificationId: string | null = null;

  async initialize() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
    }
  }

  async showMediaNotification(track: Track) {
    try {
      if (this.notificationId) {
        await Notifications.dismissNotificationAsync(this.notificationId);
      }

      const notification = await Notifications.scheduleNotificationAsync({
        content: {
          title: track.title,
          body: track.artist,
          sound: false,
          sticky: true,
        },
        trigger: null,
      });

      this.notificationId = notification;
    } catch (error) {
      console.error('Error showing media notification:', error);
    }
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
