import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LyricsLine } from '../types/music';

interface LyricsViewProps {
  lyrics: LyricsLine[];
  currentPosition: number;
  onSeek: (position: number) => void;
}

const { height } = Dimensions.get('window');

export default function LyricsView({ lyrics, currentPosition, onSeek }: LyricsViewProps) {
  const flatListRef = useRef<FlatList>(null);

  // Find the index of the current active line
  const activeLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentPosition >= line.time && (!nextLine || currentPosition < nextLine.time);
  });

  useEffect(() => {
    if (activeLineIndex !== -1) {
      flatListRef.current?.scrollToIndex({
        index: activeLineIndex,
        animated: true,
        viewPosition: 0.3, // Scroll so the active line is roughly at 1/3 of the screen
      });
    }
  }, [activeLineIndex]);

  const renderItem = ({ item, index }: { item: LyricsLine; index: number }) => {
    const isActive = index === activeLineIndex;
    return (
      <TouchableOpacity onPress={() => onSeek(item.time)}>
        <Text
          style={[
            styles.lyricText,
            isActive && styles.activeLyricText,
            index < activeLineIndex && styles.pastLyricText,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={lyrics}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: 60, // Estimated height of each lyric line
          offset: 60 * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height * 0.6,
  },
  contentContainer: {
    paddingTop: height * 0.1,
    paddingBottom: height * 0.3,
    paddingHorizontal: 20,
  },
  lyricText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 15,
    textAlign: 'left',
  },
  activeLyricText: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  pastLyricText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
