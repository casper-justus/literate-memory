import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Button, Card } from '../components';
import { useStorage } from '../hooks/useStorage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Item {
  id: string;
  title: string;
  description: string;
}

export default function HomeScreen({ navigation }: Props) {
  const [items] = useState<Item[]>([
    {
      id: '1',
      title: 'React Native',
      description: 'Build native apps with React',
    },
    {
      id: '2',
      title: 'Expo',
      description: 'The fastest way to build an app',
    },
    {
      id: '3',
      title: 'TypeScript',
      description: 'JavaScript with syntax for types',
    },
    {
      id: '4',
      title: 'Navigation',
      description: 'Routing and navigation for React Native',
    },
  ]);

  const { storedValue: username, setValue: setUsername } = useStorage<string>(
    'username',
    'Guest'
  );

  const renderItem = ({ item }: { item: Item }) => (
    <Card>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Details"
          onPress={() =>
            navigation.navigate('Details', {
              itemId: item.id,
              title: item.title,
            })
          }
          variant="primary"
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <Button
          title="View Profile"
          onPress={() => navigation.navigate('Profile')}
          variant="secondary"
          style={styles.profileButton}
        />
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  profileButton: {
    marginTop: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
});
