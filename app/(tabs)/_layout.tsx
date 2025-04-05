import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <LinearGradient
            colors={['#61D2C4', '#29D890']}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            elevation: 0,
            borderTopWidth: 0,
            height: 60,
            backgroundColor: 'transparent', // Transparent to show gradient
          },
          default: {
            height: 60,
            elevation: 0,
            borderTopWidth: 0,
            backgroundColor: 'transparent', // Transparent to show gradient
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: '',
          tabBarButton: (props: TouchableOpacityProps) => (
            <TouchableOpacity
              {...props}
              style={styles.plusButton}
              onPress={() => {
                // Navigate to the camera screen
                console.log('Camera button pressed');
              }}>
              <View style={[styles.plusButtonInner, { backgroundColor: '#48A2F5' }]}>
                <Ionicons name="camera" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
});
