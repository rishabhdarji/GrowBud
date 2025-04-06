import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, TextInput, ScrollView, View, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const plants = [
  { id: '1', source: require('../../assets/images/mini-plant.png') },
  { id: '2', source: require('../../assets/images/mini-plant.png') },
  { id: '3', source: require('../../assets/images/mini-plant.png') },
  { id: '4', source: require('../../assets/images/mini-plant.png') },
  { id: '5', source: require('../../assets/images/mini-plant.png') },
  { id: '6', source: require('../../assets/images/mini-plant.png') },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6CC1E0" />
      <LinearGradient
        colors={['#61D2C4', '#29D890']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.greeting}>Hello Apurv,</ThemedText>
            <ThemedText style={styles.subtitle}>Let's Learn More About Plants</ThemedText>
          </View>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search For Plants"
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>

      <ThemedView style={styles.content}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => navigation.navigate('camera')} // Navigate to the camera screen
          >
            <Image 
              source={require('../../assets/icons/camera.png')} 
              style={styles.categoryIcon} 
            />
            <ThemedText style={styles.categoryText}>Camera</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryButton}>
            <Image 
              source={require('../../assets/icons/species.jpg')} 
              style={styles.categoryIcon} 
            />
            <ThemedText style={styles.categoryText}>Species</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.categoryButton}>
            <Image 
              source={require('../../assets/icons/article.png')} 
              style={styles.categoryIcon} 
            />
            <ThemedText style={styles.categoryText}>Articles</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderContainer}>
          <ThemedText style={styles.sectionTitle}>My Plants</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.plantCard}>
              <Image source={item.source} style={styles.plantImage} />
            </TouchableOpacity>
          )}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFF', // Set the background color to white
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FC',
    borderRadius: 12,
    padding: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  plantCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    aspectRatio: 1,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  plantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
