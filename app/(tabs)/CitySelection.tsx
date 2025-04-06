import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationState } from './_layout';

type RootStackParamList = {
  CameraScreen: undefined;
  CitySelection: { base64Image: string | null };
  OccupationSelection: { base64Image: string | null; selectedCity: string };
};

type CitySelectionRouteProp = RouteProp<RootStackParamList, 'CitySelection'>;
type CitySelectionNavigationProp = StackNavigationProp<RootStackParamList, 'CitySelection'>;

export default function CitySelection({ route }: { route?: CitySelectionRouteProp }) {
  const { navigationParams, setNavigationParams } = useNavigationState();
  
  // Get image from route params or from navigation context
  const base64Image = route?.params?.base64Image || navigationParams.base64Image;
  const [selectedCity, setSelectedCity] = useState<string | null>(navigationParams.selectedCity || null);
  const navigation = useNavigation<CitySelectionNavigationProp>();
  const insets = useSafeAreaInsets();

  // Log for debugging
  useEffect(() => {
    console.log('CitySelection received params:', {
      base64Image: base64Image ? 'Base64 image available' : 'No image',
      selectedCity,
      fromRoute: route?.params ? 'Yes' : 'No',
      fromNavigationContext: navigationParams.base64Image ? 'Yes' : 'No'
    });
  }, [base64Image, selectedCity, navigationParams]);

  // Expanded list of cities for selection
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Indianapolis',
    'Charlotte', 'Seattle', 'Denver', 'Washington DC', 'Boston',
    'Nashville', 'Baltimore', 'Louisville', 'Portland', 'Las Vegas'
  ];

  const handleContinue = () => {
    if (selectedCity) {
      // Update the navigation context
      setNavigationParams({
        ...navigationParams,
        base64Image,
        selectedCity
      });
      
      // Navigate with parameters
      navigation.navigate('OccupationSelection', { 
        base64Image, 
        selectedCity 
      });
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#61D2C4', '#29D890']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Select Your City</ThemedText>
          <ThemedText style={styles.subtitle}>
            Please select the city where you will be growing plants
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityButton,
              selectedCity === city && styles.selectedButton
            ]}
            onPress={() => setSelectedCity(city)}
          >
            <ThemedText style={[
              styles.cityText,
              selectedCity === city && styles.selectedText
            ]}>
              {city}
            </ThemedText>
            {selectedCity === city && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedCity && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={!selectedCity}
      >
        <ThemedText style={styles.nextButtonText}>Next</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    marginBottom: 10,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#E8F7EF',  // Light green for better visibility
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#186048',  // Navy green for selected state
    borderWidth: 0,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#186048',  // Darker text for better contrast
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#6CC1E0',
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
