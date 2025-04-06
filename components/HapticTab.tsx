import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type HapticTabProps = {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  focused: boolean;
};

export const HapticTab = ({ name, icon, onPress, focused }: HapticTabProps) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tabContainer}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={24}
          color={focused ? '#90EE90' : '#666'}
        />
      </View>
      <ThemedText style={[
        styles.tabText,
        focused && styles.focusedText
      ]}>
        {name}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 2,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  focusedText: {
    color: '#90EE90',
    fontWeight: '500',
  }
});