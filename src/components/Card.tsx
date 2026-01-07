import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

// ⚡ Bolt: Memoized Card component to prevent unnecessary re-renders.
// This is a pure component, so it will only re-render if its props (children, style) change.
// This is particularly useful in screens with frequent state updates, like MusicPlayerScreen.
const Card = React.memo(({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
});

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
});
