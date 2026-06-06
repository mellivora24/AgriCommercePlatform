import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(({ label, error, style, ...props }, ref) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput ref={ref} placeholderTextColor="#94a3b8" style={[styles.input, style]} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#14532d',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    color: '#0f172a',
  },
  error: {
    color: '#b91c1c',
    fontSize: 12,
  },
});
