import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Button, Card, Input } from '../components';

type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Details'
>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

interface Props {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
}

export default function DetailsScreen({ navigation, route }: Props) {
  const { itemId, title } = route.params;
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');

  const handleSave = () => {
    setSavedNote(note);
    setNote('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Item Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{itemId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{title}</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Add a Note</Text>
        <Input
          placeholder="Enter your note here..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          style={styles.noteInput}
        />
        <Button
          title="Save Note"
          onPress={handleSave}
          disabled={!note.trim()}
        />
      </Card>

      {savedNote && (
        <Card>
          <Text style={styles.sectionTitle}>Saved Note</Text>
          <Text style={styles.savedNoteText}>{savedNote}</Text>
        </Card>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    width: 80,
  },
  value: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  savedNoteText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
