import React from 'react';
import { Text, TextProps, useColorScheme } from 'react-native';

export function ThemedText(props: TextProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#fff' : '#000';
  
  return (
    <Text {...props} style={[{ color }, props.style]} />
  );
}