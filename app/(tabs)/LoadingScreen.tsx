import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from './_layout';

type RootStackParamList = {
  OccupationSelection: { base64Image: string | null; selectedCity: string };
  LoadingScreen: { base64Image: string | null; selectedCity: string; selectedOccupation: string };
  ResultScreen: { base64Image: string | null; selectedCity: string; selectedOccupation: string };
};

type LoadingScreenRouteProp = RouteProp<RootStackParamList, 'LoadingScreen'>;
type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoadingScreen'>;

export default function LoadingScreen({ route }: { route?: LoadingScreenRouteProp }) {
  const { navigationParams, setNavigationParams } = useNavigationState();

  // Get data from route params or navigation context
  const paramsFromRoute = route?.params || { base64Image: null, selectedCity: '', selectedOccupation: '' };
  const base64Image = paramsFromRoute.base64Image || navigationParams.base64Image;
  const selectedCity = paramsFromRoute.selectedCity || navigationParams.selectedCity;
  const selectedOccupation = paramsFromRoute.selectedOccupation || navigationParams.selectedOccupation;

  const navigation = useNavigation<LoadingScreenNavigationProp>();

  // Animation values
  const rotationAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(0.8);

  // Log for debugging
  useEffect(() => {
    console.log('LoadingScreen received params:', {
      base64Image: base64Image ? 'Base64 image available' : 'No image',
      selectedCity,
      selectedOccupation,
      fromRoute: route?.params ? 'Yes' : 'No',
      fromNavigationContext: navigationParams.base64Image ? 'Yes' : 'No',
    });
  }, [base64Image, selectedCity, selectedOccupation, navigationParams]);

  useEffect(() => {
    // Animate rotation
    Animated.loop(
      Animated.timing(rotationAnimation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animate scale
    Animated.timing(scaleAnimation, {
      toValue: 1.2,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Navigate to result screen after animation with all parameters
    const timer = setTimeout(() => {
      navigation.navigate('ResultScreen', {
        base64Image,
        selectedCity,
        selectedOccupation,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [base64Image, selectedCity, selectedOccupation, navigation]);

  // Calculate rotation in degrees
  const rotation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.loadingContainer}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate: rotation }, { scale: scaleAnimation }],
            },
          ]}
        >
          <View style={styles.circleOuter}>
            <Ionicons name="leaf" size={40} color="#29D890" />
          </View>

          <View style={[styles.leaf, styles.leafTop]}>
            <Ionicons name="leaf-outline" size={24} color="#6CC1E0" />
          </View>

          <View style={[styles.leaf, styles.leafRight]}>
            <Ionicons name="leaf-outline" size={24} color="#90EE90" />
          </View>

          <View style={[styles.leaf, styles.leafBottom]}>
            <Ionicons name="leaf-outline" size={24} color="#6CC1E0" />
          </View>

          <View style={[styles.leaf, styles.leafLeft]}>
            <Ionicons name="leaf-outline" size={24} color="#90EE90" />
          </View>
        </Animated.View>

        <ActivityIndicator size="large" color="#29D890" style={styles.spinner} />
        <ThemedText style={styles.loadingText}>Identifying plant...</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 150,
    height: 150,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  circleOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(41, 216, 144, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaf: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  leafTop: {
    top: 0,
  },
  leafRight: {
    right: 0,
  },
  leafBottom: {
    bottom: 0,
  },
  leafLeft: {
    left: 0,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#29D890',
  },
});
