import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Simplified App component that doesn't include NavigationContainer
export default function App() {
  return (
    <SafeAreaProvider>
      {/* Expo Router will handle navigation */}
    </SafeAreaProvider>
  );
}
