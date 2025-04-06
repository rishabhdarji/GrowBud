// screens/PlantDetailsScreen.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Plant = {
  name: string;
  scientificName: string;
  description: string;
  careInstructions: string;
  benefits: string[];
};

type RootStackParamList = {
  index: undefined;           // your home page route
  PlantDetails: { plant: Plant };
};

type DetailsRouteProp = RouteProp<RootStackParamList, 'PlantDetails'>;
type DetailsNavProp   = StackNavigationProp<RootStackParamList, 'PlantDetails'>;

export default function PlantDetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const navigation = useNavigation<DetailsNavProp>();
  const { plant } = route.params;

  const handleAddPlant = async () => {
    try {
      const res = await fetch('http://192.168.1.38:3000/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        plant.name,
          nickname:    " ",
          description: plant.description
            // you can prompt later if desired
        }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      await res.json();
      // Navigate back to your index.tsx home screen
      navigation.navigate('index');
    } catch (err) {
      console.error('Add plant error:', err);
      Alert.alert('Error', 'Could not add plant. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.title}>{plant.name}</ThemedText>
        <ThemedText style={styles.scientific}>{plant.scientificName}</ThemedText>

        <ThemedText style={styles.section}>Description</ThemedText>
        <ThemedText style={styles.text}>{plant.description}</ThemedText>

        <ThemedText style={styles.section}>Care Instructions</ThemedText>
        <ThemedText style={styles.text}>{plant.careInstructions}</ThemedText>

        <ThemedText style={styles.section}>Benefits</ThemedText>
        {plant.benefits.map((b, i) => (
          <View key={i} style={styles.benefit}>
            <ThemedText style={styles.text}>• {b}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
        <ThemedText style={styles.addButtonText}>Add Plant</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: 16, paddingBottom: 100 },
  title:     { fontSize: 28, fontWeight: 'bold', color: '#186048', marginBottom: 4 },
  scientific:{ fontSize: 16, fontStyle: 'italic', color: '#666', marginBottom: 20 },
  section:   { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  text:      { fontSize: 16, color: '#444', lineHeight: 22 },
  benefit:   { marginVertical: 4 },
  addButton: {
    position: 'absolute',
    bottom:   20,
    left:     16,
    right:    16,
    backgroundColor: '#29D890',
    paddingVertical: 16,
    borderRadius:    30,
    alignItems:      'center'
  },
  addButtonText: {
    color:    '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});