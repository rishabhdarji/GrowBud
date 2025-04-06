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
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#29D890',
          tabBarStyle: {
            height: 70,
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarItemStyle: {
            flex: 1, // Ensure all items grow and shrink proportionally
            alignItems: 'center',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarItemStyle: { alignItems: 'flex-start' }, // Align Home to the left
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: '',
            tabBarItemStyle: { alignItems: 'center' }, // Center Camera
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera" size={size} color="#fff" />
            ),
            tabBarIconStyle: {
              backgroundColor: '#29D890',
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -20, // Lift Camera button
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Profile',
            tabBarItemStyle: { alignItems: 'flex-end' }, // Align Profile to the right
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="AppNavigator"
          options={{
            tabBarButton: () => null, // Hide AppNavigator from the tab bar
          }}
        />
        {/* Hide these screens from tab bar */}
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
        <Tabs.Screen
          name="PlantDetailsScreen"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </NavigationStateContext.Provider>
  );
}