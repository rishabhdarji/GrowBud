import { StyleSheet, StatusBar } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ThemedView 
        style={[
          styles.content, 
          { marginTop: insets.top, marginBottom: insets.bottom }
        ]}
      >
        <ThemedView style={styles.iconContainer}>
          <Ionicons name="camera" size={64} color="#4CAF50" />
        </ThemedView>
        <ThemedText style={styles.title}>Camera Coming Soon</ThemedText>
        <ThemedText style={styles.description}>
          This feature will allow you to scan and identify plants using your camera.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  }
});