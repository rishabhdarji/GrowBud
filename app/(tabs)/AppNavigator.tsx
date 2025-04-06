import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from './camera';
import CitySelection from './CitySelection';
import OccupationSelection from './OccupationSelection';
import LoadingScreen from './LoadingScreen';
import ResultScreen from './ResultScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="CameraScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="CitySelection" component={CitySelection} />
      <Stack.Screen name="OccupationSelection" component={OccupationSelection} />
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}
