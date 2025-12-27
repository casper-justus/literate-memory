import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Card, Input } from '../components';
import { useStorage } from '../hooks/useStorage';
import { isValidEmail } from '../utils/validators';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

interface UserProfile {
  username: string;
  email: string;
  bio: string;
}

export default function ProfileScreen({ navigation }: Props) {
  const { storedValue: profile, setValue: setProfile, loading } = useStorage<UserProfile>(
    'userProfile',
    {
      username: 'Guest',
      email: '',
      bio: '',
    }
  );

  const [username, setUsername] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [emailError, setEmailError] = useState('');

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    if (email && !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    await setProfile({
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
    });

    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const defaultProfile = {
              username: 'Guest',
              email: '',
              bio: '',
            };
            await setProfile(defaultProfile);
            setUsername(defaultProfile.username);
            setEmail(defaultProfile.email);
            setBio(defaultProfile.bio);
            setEmailError('');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Edit Profile</Text>
        
        <Input
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={styles.bioInput}
        />

        <Button
          title="Save Profile"
          onPress={handleSave}
        />

        <Button
          title="Reset to Default"
          onPress={handleReset}
          variant="danger"
          style={styles.resetButton}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Current Profile</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{profile.username}</Text>
        </View>
        {profile.email && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>
        )}
        {profile.bio && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bio:</Text>
            <Text style={styles.value}>{profile.bio}</Text>
          </View>
        )}
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Main')}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  resetButton: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
