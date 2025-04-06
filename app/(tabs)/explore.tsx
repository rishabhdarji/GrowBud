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
          paddingBottom: 100
        }}
      >
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <ThemedText style={styles.profileName}>Apurv Gaikwad</ThemedText>
          <ThemedText style={styles.profileBio}>Plant enthusiast & nature photographer</ThemedText>
          
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statNumber}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Plants</ThemedText>
            </ThemedView>
            <View style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statNumber}>156</ThemedText>
              <ThemedText style={styles.statLabel}>Saved</ThemedText>
            </ThemedView>
            <View style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statNumber}>9</ThemedText>
              <ThemedText style={styles.statLabel}>Groups</ThemedText>
            </ThemedView>
          </ThemedView>

          <TouchableOpacity style={styles.editProfileButton}>
            <ThemedText style={styles.editProfileButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* My Collection Section */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>My Collection</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <ThemedView style={styles.plantCard}>
            <Image 
              source={require('../../assets/images/7-plant.jpg')} 
              style={styles.plantImage} 
            />
            <ThemedView style={styles.plantDetails}>
              <ThemedText style={styles.plantName}>Monstera</ThemedText>
              <ThemedText style={styles.plantStatus}>Healthy</ThemedText>
              <ThemedView style={styles.waterIndicator}>
                <Ionicons name="water" size={16} color="#4CAF50" />
                <ThemedText style={styles.waterText}>Watered 2d ago</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.plantCard}>
            <Image 
              source={require('../../assets/images/snake-plant.jpg')} 
              style={styles.plantImage} 
            />
            <ThemedView style={styles.plantDetails}>
              <ThemedText style={styles.plantName}>Snake Plant</ThemedText>
              <ThemedText style={styles.plantStatus}>Needs Water</ThemedText>
              <ThemedView style={styles.waterIndicator}>
                <Ionicons name="water" size={16} color="#FF5722" />
                <ThemedText style={[styles.waterText, {color: '#FF5722'}]}>Water today</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.plantCard}>
            <Image 
              source={require('../../assets/images/fiddle-plant.jpg')} 
              style={styles.plantImage} 
            />
            <ThemedView style={styles.plantDetails}>
              <ThemedText style={styles.plantName}>Fiddle Fig</ThemedText>
              <ThemedText style={styles.plantStatus}>Healthy</ThemedText>
              <ThemedView style={styles.waterIndicator}>
                <Ionicons name="water" size={16} color="#4CAF50" />
                <ThemedText style={styles.waterText}>Watered 1d ago</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>

        {/* Recent Activity Section */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
        </ThemedView>

        <ThemedView style={styles.activityContainer}>
          <ThemedView style={styles.activityItem}>
            <ThemedView style={styles.activityIconContainer}>
              <Image source={require('../../assets/icons/camera.png')} style={styles.activityIcon} />
            </ThemedView>
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityText}>
                You scanned a <ThemedText style={styles.activityHighlight}>Peace Lily</ThemedText>
              </ThemedText>
              <ThemedText style={styles.activityTime}>2 days ago</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.activityItem}>
            <ThemedView style={[styles.activityIconContainer, {backgroundColor: '#7986CB'}]}>
              <Image source={require('../../assets/icons/camera.png')} style={styles.activityIcon} />
            </ThemedView>
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityText}>
                You saved <ThemedText style={styles.activityHighlight}>5 plants</ThemedText> to your collection
              </ThemedText>
              <ThemedText style={styles.activityTime}>5 days ago</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.activityItem}>
            <ThemedView style={[styles.activityIconContainer, {backgroundColor: '#26A69A'}]}>
              <Image source={require('../../assets/icons/species.jpg')} style={styles.activityIcon} />
            </ThemedView>
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityText}>
                You watered all your plants
              </ThemedText>
              <ThemedText style={styles.activityTime}>1 week ago</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  activityIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  editProfileButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#6CC1E0',
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6CC1E0',
    fontWeight: '500',
  },
  horizontalScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  plantCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: 200,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plantImage: {
    width: '100%',
    height: 120,
  },
  plantDetails: {
    padding: 16,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  plantStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  waterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  activityContainer: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6CC1E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityHighlight: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  activityTime: {
    fontSize: 12,
    color: '#888',
  },
});
