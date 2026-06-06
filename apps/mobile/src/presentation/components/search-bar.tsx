import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Tìm kiếm...',
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#d9f99d', '#84cc16'],
  });

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <Animated.View style={[styles.wrapper, { borderColor }]}>
      {/* Search icon */}
      <Animated.Text style={[styles.icon, focused && styles.iconFocused]}>🔍</Animated.Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        {...rest}
      />

      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}
        >
          <View style={styles.clearCircle}>
            <Animated.Text style={styles.clearIcon}>✕</Animated.Text>
          </View>
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: '#84cc16',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    fontSize: 15,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
    fontWeight: '500',
  },
  clearBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '700',
    lineHeight: 12,
  },
});
