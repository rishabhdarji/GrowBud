import { StyleSheet, Image, ScrollView, TouchableOpacity, View, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: 100,
        }}
      >
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <ThemedText style={styles.profileName}>Apurv</ThemedText>
          <ThemedText style={styles.profileLocation}>
            <Ionicons name="location-outline" size={16} color="#FFF" /> Chicago, Illinois
          </ThemedText>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
          </TouchableOpacity>
        </ThemedView>

        {/* Tabs */}
        <ThemedView style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
            <ThemedText style={styles.activeTabText}>My Plants</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <ThemedText style={styles.tabText}>Articles</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton}>
            <ThemedText style={styles.tabText}>Likes</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Collected Plants Section */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Your Collected Plants</ThemedText>
        </ThemedView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <ThemedView style={styles.plantCard}>
            <Image
              source={require('../../assets/images/mini-plant.png')}
              style={styles.plantImage}
            />
            <ThemedText style={styles.plantName}>Alagatre Plant</ThemedText>
            <ThemedText style={styles.plantDate}>02 . 01 . 2019</ThemedText>
          </ThemedView>
          {/* Add more plant cards as needed */}
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  profileHeader: {
    backgroundColor: '#6CC1E0',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFF',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileLocation: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 6,
    opacity: 0.9,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: -25,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#6CC1E0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginTop: 10,
    paddingBottom: 5,
  },
  plantCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 160,
    marginRight: 16,
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plantImage: {
    width: 110,
    height: 110,
    marginBottom: 15,
    borderRadius: 10,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  plantDate: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
});
