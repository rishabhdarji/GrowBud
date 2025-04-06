import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationState } from './_layout';

type RootStackParamList = {
  OccupationSelection: { base64Image: string | null; selectedCity: string };
  ResultScreen: { base64Image: string | null; selectedCity: string; selectedOccupation: string; recommendations: any };
  CameraScreen: undefined;
};

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;
// type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResultScreen'>;

// Default image URLs to use as fallbacks
const DEFAULT_IMAGES = {
  "Aloe Vera": "https://www.almanac.com/sites/default/files/styles/large/public/image_nodes/aloe-vera-1.jpg",
  "Snake Plant": "https://www.thespruce.com/thmb/qrHR7RdblRF5hZCDVuF_ytEcjL0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/snake-plant-care-guide-4797223-hero-0965166b8f6c4e1b8635283640875e8c.jpg",
  "Pothos": "https://www.thespruce.com/thmb/3aKnK-WUNhCZbj6S_iY1NQ5-1H0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pothos-plant-complete-guide-1902779-hero-0a8f0186e8e94dd2b553623a863ea917.jpg"
};

// Sample plant database without image URLs
const plantDatabase = {
  "Aloe Vera": {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    description: "Aloe vera is a succulent plant species of the genus Aloe. It's widely used in cosmetic, pharmaceutical, and food industries. The gel from its leaves has healing properties for minor burns and skin irritations.",
    careInstructions: "Needs bright, indirect sunlight. Water deeply but infrequently, allowing soil to dry between waterings. Thrives in well-draining soil.",
    benefits: [
      "Has healing properties for minor burns and cuts",
      "Air purifying qualities",
      "Low maintenance and drought resistant",
      "Natural moisturizer for skin"
    ]
  },
  "Snake Plant": {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    description: "The snake plant is a popular houseplant with stiff, upright leaves that range from one to eight feet tall. It's one of the most tolerant houseplants you can grow, making it perfect for beginners.",
    careInstructions: "Tolerates low light but thrives in bright light. Very drought-tolerant, water only when soil is completely dry. Prefers warm temperatures.",
    benefits: [
      "Excellent air purifier, especially at night",
      "Very low maintenance",
      "Tolerant of neglect and poor conditions",
      "Long-lasting and pest resistant"
    ]
  },
  "Pothos": {
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    description: "Pothos is an easy-to-grow indoor plant that features heart-shaped leaves on long, trailing stems. It's a durable plant that can tolerate a variety of growing conditions.",
    careInstructions: "Thrives in medium to low indirect light. Water when the top inch of soil feels dry. Tolerates a wide range of temperatures.",
    benefits: [
      "Excellent air purifier",
      "Very adaptable to different light conditions",
      "Easy to propagate",
      "Grows quickly, providing immediate visual impact"
    ]
  }
};

// Function to fetch plant images from Unsplash
const fetchPlantImage = async (query: string): Promise<string> => {
  try {
    const apiKey = "6yRwplrJ5hOEE2XvQKTg0x_ywETK3mIZ9NtoDaAwIlg";
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`);
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || '';
  } catch (error) {
    console.error("Error fetching image:", error);
    return ''; // Return empty string on failure
  }
};

export default function ResultScreen() {
  const { navigationParams, setNavigationParams } = useNavigationState();
  const insets = useSafeAreaInsets();
//   const navigation = useNavigation<ResultScreenNavigationProp>();
//   const paramsFromRoute = route?.params || { base64Image: null, selectedCity: '', selectedOccupation: '', recommendations: null };
//   const base64Image = paramsFromRoute.base64Image || navigationParams.base64Image;
//   const selectedCity = paramsFromRoute.selectedCity || navigationParams.selectedCity;
//   const selectedOccupation = paramsFromRoute.selectedOccupation || navigationParams.selectedOccupation;
//   const recommendations = paramsFromRoute.recommendations || null;

  const [plantInfo, setPlantInfo] = useState<any[]>([]); // Updated to store an array of recommendations
  const route = useRoute<ResultScreenRouteProp>();
  const {
    base64Image,
    selectedCity,
    selectedOccupation,
    recommendations  // ← here’s the array you passed
  } = route.params;

  useEffect(() => {
    console.log('Received recommendations:', recommendations); // Debugging log
    if (recommendations && Array.isArray(recommendations)) {
      setPlantInfo(recommendations); // Store the recommendations array
    } else {
      console.warn('No valid recommendations provided. Ensure API call was successful.');
    }
  }, [recommendations]);

  // Handle back button navigation to OccupationSelection with all needed parameters
  const handleBackNavigation = () => {
    navigation.navigate('OccupationSelection', { 
      base64Image,
      selectedCity 
    });
  };

  // Handle "Identify Another Plant" action
  const handleIdentifyAnother = () => {
    // Reset navigation params to clear previous selections
    setNavigationParams({
      base64Image: null,
      selectedCity: '',
      selectedOccupation: '',
    });
    
    // Navigate to camera screen
    navigation.navigate('camera');
  };
  console.log("plantInfo: ", plantInfo);

  if (!plantInfo || plantInfo.length === 0) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29D890" />
          <ThemedText style={styles.loadingText}>Loading recommendations...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      {/* Header with back button */}
      <LinearGradient
        colors={['#61D2C4', '#29D890']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackNavigation}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>Plant Recommendations</ThemedText>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {plantInfo.map((plant, index) => (
          <View key={index} style={styles.infoCard}>
            <ThemedText style={styles.plantName}>{plant.name}</ThemedText>
            <ThemedText style={styles.scientificName}>{plant.scientificName}</ThemedText>
            <ThemedText style={styles.description}>{plant.description}</ThemedText>
            <ThemedText style={styles.sectionTitle}>Care Instructions</ThemedText>
            <ThemedText style={styles.description}>{plant.careInstructions}</ThemedText>
            <ThemedText style={styles.sectionTitle}>Benefits</ThemedText>
            {plant.benefits.map((benefit: string, benefitIndex: number) => (
              <View key={benefitIndex} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#29D890" />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      
      {/* Bottom action buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleIdentifyAnother}
        >
          <Ionicons name="camera" size={20} color="#fff" />
          <ThemedText style={styles.actionButtonText}>Identify Another Plant</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 16,
  },
  plantName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#186048',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 15,
    marginLeft: 8,
    color: '#444',
    flex: 1,
  },
  learnMoreButton: {
    backgroundColor: '#6CC1E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
  learnMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#29D890',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
