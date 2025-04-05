import { Image, StyleSheet, TextInput, ScrollView, TouchableOpacity, View, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 100
        }}
      >
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedView>
            <ThemedText style={styles.greeting}>Hello Taylor,</ThemedText>
            <ThemedText style={styles.subtitle}>Let's Learn More About Plants</ThemedText>
          </ThemedView>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.profileImage}
          />
        </ThemedView>

        {/* Search Bar */}
        <ThemedView style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search For Plants"
            placeholderTextColor="#999"
          />
        </ThemedView>

        {/* Quick Action Buttons */}
        <ThemedView style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedView style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={22} color="#fff" />
            </ThemedView>
            <ThemedText style={styles.actionText}>Camera</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedView style={styles.iconContainer}>
              <Ionicons name="leaf-outline" size={22} color="#fff" />
            </ThemedView>
            <ThemedText style={styles.actionText}>Species</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedView style={styles.iconContainer}>
              <Ionicons name="newspaper-outline" size={22} color="#fff" />
            </ThemedView>
            <ThemedText style={styles.actionText}>Articles</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Plant Types Section */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Plant Types</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <ThemedView style={styles.card}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.cardImage} 
            />
            <ThemedView style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>Home Plants</ThemedText>
              <ThemedText style={styles.cardSubtitle}>68 Types of Plants</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.card}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.cardImage} 
            />
            <ThemedView style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>Humid Plants</ThemedText>
              <ThemedText style={styles.cardSubtitle}>102 Types of Plants</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.card}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1509223197845-458d87318791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.cardImage} 
            />
            <ThemedView style={styles.cardContent}>
              <ThemedText style={styles.cardTitle}>Succulents</ThemedText>
              <ThemedText style={styles.cardSubtitle}>45 Types of Plants</ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Photography Section */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Photography</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <ThemedView style={styles.photoGrid}>
          <TouchableOpacity style={styles.photoCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1520302519943-6071779f0551?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.photoImage} 
            />
            <ThemedView style={styles.photoTagContainer}>
              <ThemedText style={styles.photoTag}>#Mini</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1515513292257-0456dbed7941?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
              style={styles.photoImage} 
            />
            <ThemedView style={styles.photoTagContainer}>
              <ThemedText style={styles.photoTag}>#Plant</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  iconContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: 220,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  photoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  photoCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  photoTagContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  photoTag: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
