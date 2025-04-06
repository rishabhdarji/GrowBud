import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image, ActivityIndicator, Platform, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
//import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from 'expo-constants';


export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === 'granted');
      
      if (cameraStatus !== 'granted') {
        Alert.alert(
          Platform.OS === 'ios' 
            ? "Camera Permission Required" 
            : "Camera Permission Needed",
          "We need camera access to identify plants. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      setIsLoading(true);
      
      // Use ImagePicker to launch the native camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      setIsLoading(false);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        
        // Convert to base64
        await convertToBase64(imageUri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const convertToBase64 = async (imageUri: string) => {
    try {
      setIsLoading(true);
      
      // Resize and compress the image before converting to base64
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // resize to reduce file size
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      setBase64Image(manipResult.base64 || null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error converting image:", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to process image. Please try again.");
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setBase64Image(null);
  };

   // Get the development server URL
   const getServerUrl = () => {
    if (__DEV__) {
      // Get the development server IP from Expo
      const { manifest } = Constants;
      
      // For newer Expo versions (SDK 46+)
      if (manifest && manifest.debuggerHost) {
        const hostUri = manifest.debuggerHost;
        const host = hostUri.split(':')[0];
        if (host) {
          return `http://${host}:3000`;
        }
      }
      // Fallback for older Expo versions
      else if (manifest && manifest.hostUri) {
        const hostUri = manifest.hostUri;
        const host = hostUri.split(':')[0];
        if (host) {
          return `http://${host}:3000`;
        }
      }
    }
    // Fallback to your hardcoded server URL
    return 'http://192.168.1.7:3000';
  };

  const identifyPlant = async() => {
    if (base64Image) {
      Alert.alert(
        "Plant Identification", 
        "Ready to identify this plant! In a real app, this would send the image to your backend for processing.",
        [{ text: "OK" }]
      );
      
      // Here you would send the base64Image to your backend
      const payload = {
        image: base64Image,  // e.g. "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQImWNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="
        location: { city: "Chicago" }, // Or use { lat: 40.7128, lon: -74.0060 }
        userType: "Working Professional"
      };
      try {
    const response = await fetch('http://192.168.1.7:3000/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response from API:', data);

    Alert.alert(
      "Plant Identified",
      `The plant is identified as: ${data.recommendations[0].name || 'Unknown'}`,
      [{ text: "OK" }]
    );


        // Proceed with the API request or other logic
      } catch (error) {
        console.error('Error writing payload to file:', error);
        Alert.alert("Error", "Failed to write payload to file.");
      }
    
      
    }
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText style={styles.centeredText}>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top, backgroundColor: '#fff' }]}>
        <StatusBar style="dark" />
        <View style={styles.permissionContainer}>
          <Ionicons name="close-circle" size={70} color="#FF6B6B" />
          <ThemedText style={styles.permissionTitle}>Camera Access Denied</ThemedText>
          <ThemedText style={styles.permissionText}>
            We need camera access to identify plants. Please enable camera access in your device settings.
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={async () => {
              // For iOS, this will redirect to app settings
              // For Android, this will re-request permission
              if (Platform.OS === 'ios') {
                await Linking.openSettings();
              } else {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
              }
            }}
          >
            <ThemedText style={styles.permissionButtonText}>
              {Platform.OS === 'ios' ? 'Open Settings' : 'Try Again'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={capturedImage ? "light" : "dark"} />
      
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.actionButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <ThemedText style={styles.actionText}>Retake</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.identifyButton]} 
              onPress={identifyPlant}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="leaf" size={24} color="#fff" />
                  <ThemedText style={styles.actionText}>Identify Plant</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <View style={styles.instructionContainer}>
            <Ionicons name="camera" size={40} color="#90EE90" />
            <ThemedText style={styles.instructionTitle}>
              Take a Picture of a Plant
            </ThemedText>
            <ThemedText style={styles.instructionText}>
              Use your device's camera to take a clear photo of the plant you want to identify.
            </ThemedText>
          </View>
          
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <View style={styles.captureButtonInner}>
                <Ionicons name="camera" size={30} color="#90EE90" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#6CC1E0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#90EE90',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  identifyButton: {
    backgroundColor: '#90EE90',
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});