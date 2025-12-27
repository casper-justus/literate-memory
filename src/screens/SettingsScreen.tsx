import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Card, Input, Button } from '../components';
import { useStorage } from '../hooks/useStorage';
import BackendMusicService, {
  BackendMusicService as BackendMusicServiceClass,
} from '../services/BackendMusicService';

interface AppSettings {
  useBackendApi: boolean;
  backendUrl: string;
  audioQuality: 'high' | 'medium' | 'low';
  autoPlay: boolean;
  showNotifications: boolean;
}

export default function SettingsScreen() {
  const { storedValue: settings, setValue: setSettings } =
    useStorage<AppSettings>('appSettings', {
      useBackendApi: false,
      backendUrl: 'http://localhost:3000/api/music',
      audioQuality: 'high',
      autoPlay: true,
      showNotifications: true,
    });

  const [localSettings, setLocalSettings] = useState(settings);
  const [backendStatus, setBackendStatus] = useState<
    'unknown' | 'online' | 'offline'
  >('unknown');
  const [ytdlpVersion, setYtdlpVersion] = useState<string>('');

  useEffect(() => {
    checkBackendStatus();
  }, [localSettings.backendUrl]);

  const checkBackendStatus = async () => {
    try {
      const service = new BackendMusicServiceClass(localSettings.backendUrl);
      const health = await service.checkHealth();

      if (health.status === 'ok') {
        setBackendStatus('online');
        setYtdlpVersion(health.ytdlp.version || 'Unknown');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const handleSave = async () => {
    await setSettings(localSettings);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: AppSettings = {
              useBackendApi: false,
              backendUrl: 'http://localhost:3000/api/music',
              audioQuality: 'high',
              autoPlay: true,
              showNotifications: true,
            };
            setLocalSettings(defaultSettings);
            setSettings(defaultSettings);
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'online':
        return '#4CAF50';
      case 'offline':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🎵 Music Backend</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Use Backend API (yt-dlp)</Text>
            <Text style={styles.settingDescription}>
              Use local backend with yt-dlp for better quality and features
            </Text>
          </View>
          <Switch
            value={localSettings.useBackendApi}
            onValueChange={(value) =>
              setLocalSettings({ ...localSettings, useBackendApi: value })
            }
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={localSettings.useBackendApi ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        {localSettings.useBackendApi && (
          <>
            <Input
              label="Backend URL"
              placeholder="http://localhost:3000/api/music"
              value={localSettings.backendUrl}
              onChangeText={(text) =>
                setLocalSettings({ ...localSettings, backendUrl: text })
              }
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Backend Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor() },
                ]}
              >
                <Text style={styles.statusText}>{getStatusText()}</Text>
              </View>
            </View>

            {backendStatus === 'online' && ytdlpVersion && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  ✅ yt-dlp version: {ytdlpVersion}
                </Text>
              </View>
            )}

            {backendStatus === 'offline' && (
              <View style={[styles.infoBox, styles.errorBox]}>
                <Text style={styles.errorText}>
                  ⚠️ Backend is offline. Make sure the backend server is
                  running.
                </Text>
                <Text style={styles.errorSubtext}>
                  Run: cd backend && npm start
                </Text>
              </View>
            )}

            <Button
              title="Test Connection"
              onPress={checkBackendStatus}
              variant="secondary"
              style={styles.testButton}
            />
          </>
        )}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🎚️ Playback</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Play</Text>
            <Text style={styles.settingDescription}>
              Automatically play next track in queue
            </Text>
          </View>
          <Switch
            value={localSettings.autoPlay}
            onValueChange={(value) =>
              setLocalSettings({ ...localSettings, autoPlay: value })
            }
            trackColor={{ false: '#767577', true: '#007AFF' }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Audio Quality</Text>
        </View>
        <View style={styles.qualityButtons}>
          {['low', 'medium', 'high'].map((quality) => (
            <TouchableOpacity
              key={quality}
              style={[
                styles.qualityButton,
                localSettings.audioQuality === quality &&
                  styles.qualityButtonActive,
              ]}
              onPress={() =>
                setLocalSettings({
                  ...localSettings,
                  audioQuality: quality as any,
                })
              }
            >
              <Text
                style={[
                  styles.qualityButtonText,
                  localSettings.audioQuality === quality &&
                    styles.qualityButtonTextActive,
                ]}
              >
                {quality.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Show Notifications</Text>
            <Text style={styles.settingDescription}>
              Display notifications for now playing
            </Text>
          </View>
          <Switch
            value={localSettings.showNotifications}
            onValueChange={(value) =>
              setLocalSettings({ ...localSettings, showNotifications: value })
            }
            trackColor={{ false: '#767577', true: '#007AFF' }}
          />
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Settings"
          onPress={handleSave}
          style={styles.saveButton}
        />
        <Button
          title="Reset to Default"
          onPress={handleReset}
          variant="danger"
          style={styles.resetButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Music Player v1.0.0</Text>
        <Text style={styles.footerText}>with yt-dlp Backend Support</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingBottom: 160,
  },
  card: {
    margin: 16,
    backgroundColor: '#1A1A1A',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBox: {
    backgroundColor: '#1E3A1E',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  errorBox: {
    backgroundColor: '#3A1E1E',
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#AAAAAA',
    fontFamily: 'monospace',
  },
  testButton: {
    marginTop: 16,
  },
  qualityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#007AFF',
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAAAAA',
  },
  qualityButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginBottom: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
