import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, createContext, useContext } from 'react';

// Create a context to store our navigation state
export const NavigationStateContext = createContext<{
  navigationParams: {
    base64Image: string | null;
    selectedCity: string;
    selectedOccupation: string;
  };
  setNavigationParams: (params: any) => void;
}>({
  navigationParams: {
    base64Image: null,
    selectedCity: '',
    selectedOccupation: '',
  },
  setNavigationParams: () => {},
});

// Custom hook to use navigation state
export const useNavigationState = () => useContext(NavigationStateContext);

export default function TabLayout() {
  // Create state to store navigation parameters
  const [navigationParams, setNavigationParams] = useState({
    base64Image: null as string | null,
    selectedCity: '',
    selectedOccupation: '',
  });

  // For debugging
  useEffect(() => {
    console.log('Global navigation params updated:', navigationParams);
  }, [navigationParams]);

  return (
    <NavigationStateContext.Provider value={{ navigationParams, setNavigationParams }}>
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#29D890',
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Camera',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" size={size} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        
        {/* Hide these screens from tab bar but keep them accessible */}
        <Tabs.Screen
          name="CitySelection"
          options={{
            href: null,
          }}
        />
        
        <Tabs.Screen
          name="OccupationSelection"
          options={{
            href: null,
          }}
        />
        
        <Tabs.Screen
          name="LoadingScreen"
          options={{
            href: null,
          }}
        />
        
        <Tabs.Screen
          name="ResultScreen"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </NavigationStateContext.Provider>
  );
}
