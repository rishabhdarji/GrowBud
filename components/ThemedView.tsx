import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

export function ThemedView(props: ViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';
  
  return (
    <View {...props} style={[{ backgroundColor }, props.style]} />
  );
}