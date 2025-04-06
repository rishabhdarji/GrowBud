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
  CitySelection: { base64Image: string | null };
  OccupationSelection: { base64Image: string | null; selectedCity: string };
  LoadingScreen: { base64Image: string | null; selectedCity: string; selectedOccupation: string };
};

type OccupationSelectionRouteProp = RouteProp<RootStackParamList, 'OccupationSelection'>;
type OccupationSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'OccupationSelection'>;

export default function OccupationSelection({ route }: { route?: OccupationSelectionRouteProp }) {
  const { navigationParams, setNavigationParams } = useNavigationState();
  
  const paramsFromRoute = route?.params || { base64Image: null, selectedCity: '' };
  const base64Image = paramsFromRoute.base64Image || navigationParams.base64Image;
  const selectedCity = paramsFromRoute.selectedCity || navigationParams.selectedCity;
  
  const [selectedOccupation, setSelectedOccupation] = useState<string | null>(navigationParams.selectedOccupation || null);
  const navigation = useNavigation<OccupationSelectionNavigationProp>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log('OccupationSelection received params:', {
      base64Image: base64Image ? 'Base64 image available' : 'No image',
      selectedCity,
      fromRoute: route?.params ? 'Yes' : 'No',
      fromNavigationContext: navigationParams.base64Image ? 'Yes' : 'No'
    });
  }, [base64Image, selectedCity, navigationParams]);

  const occupations = [
    'Working Professional',
    'Student',
    'Housemaker',
    'Retired',
    'Business Owner',
    'Freelancer',
    'Healthcare Worker',
    'Teacher/Educator',
    'IT Professional',
    'Hospitality Worker',
    'Engineer',
    'Designer',
    'Other'
  ];

  const handleSubmit = () => {
    if (selectedOccupation) {
      setNavigationParams({
        ...navigationParams,
        base64Image,
        selectedCity,
        selectedOccupation
      });
      
      navigation.navigate('LoadingScreen', {
        base64Image,
        selectedCity,
        selectedOccupation
      });
    }
  };

  const handleBackNavigation = () => {
    navigation.navigate('CitySelection', { base64Image });
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
            onPress={handleBackNavigation}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>What best describes you?</ThemedText>
          <ThemedText style={styles.subtitle}>
            This helps us provide recommendations suited to your lifestyle
          </ThemedText>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.occupationsContainer}
        showsVerticalScrollIndicator={false}
      >
        {occupations.map((occupation) => (
          <TouchableOpacity
            key={occupation}
            style={[
              styles.occupationButton,
              selectedOccupation === occupation && styles.selectedButton
            ]}
            onPress={() => setSelectedOccupation(occupation)}
          >
            <ThemedText style={[
              styles.occupationText,
              selectedOccupation === occupation && styles.selectedText
            ]}>
              {occupation}
            </ThemedText>
            {selectedOccupation === occupation && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton,
          !selectedOccupation && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={!selectedOccupation}
      >
        <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
        <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 5}} />
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
  occupationsContainer: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  occupationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#E8F7EF',  // Light green for better visibility
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#186048',  // Navy/dark green for selected state
  },
  occupationText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#186048',  // Darker text for better contrast
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#6CC1E0',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
