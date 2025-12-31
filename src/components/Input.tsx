import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  onClear?: () => void;
}

export default function Input({
  label,
  error,
  containerStyle,
  style,
  onClear,
  value,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : {},
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#999999"
          value={value}
          {...props}
        />
        {value && value.length > 0 && onClear && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Clear search input"
          >
            <Ionicons name="close-circle" size={20} color="#999999" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  clearButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});
