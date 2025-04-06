// screens/ResultScreen.tsx
import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Your stack param list
type RootStackParamList = {
  ResultScreen: { recommendations: Array<{
    name: string;
    scientificName: string;
    description: string;
    careInstructions: string;
    benefits: string[];
  }> };
  PlantDetailsScreen: { plant: any };
};

type ResultRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;
type ResultNavProp = StackNavigationProp<RootStackParamList, 'ResultScreen'>;

export default function ResultScreen() {
  const route = useRoute<ResultRouteProp>();
  const navigation = useNavigation<ResultNavProp>();
  const { recommendations } = route.params;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedIndex === index && styles.cardSelected
      ]}
      onPress={() => setSelectedIndex(index)}
    >
      <ThemedText style={styles.name}>{item.name}</ThemedText>
      <ThemedText style={styles.care}>{item.careInstructions}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={recommendations}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedIndex === null && styles.nextButtonDisabled
        ]}
        disabled={selectedIndex === null}
        onPress={() => {
          const plant = recommendations[selectedIndex!];
          navigation.navigate('PlantDetailsScreen', { plant });
        }}
      >
        <ThemedText style={styles.nextText}>Next</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 100 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12
  },
  cardSelected: {
    backgroundColor: '#29D890'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#186048'
  },
  care: {
    marginTop: 8,
    color: '#444'
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#186048',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc'
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});