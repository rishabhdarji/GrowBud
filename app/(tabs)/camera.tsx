import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image, ActivityIndicator, Platform, Linking, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getServerUrl, saveServerConfig } from '../utils/serverConfig';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ngrokUrl, setNgrokUrl] = useState<string>('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    const loadServerUrl = async () => {
      try {
        const url = await getServerUrl();
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        setNgrokUrl(domain);
      } catch (error) {
        console.error('Failed to load server configuration', error);
      }
    };
    
    loadServerUrl();
  }, []);

  const saveNgrokUrl = async (url: string) => {
    try {
      await saveServerConfig(url);
      setNgrokUrl(url);
      setIsEditingUrl(false);
      Alert.alert('Success', 'Server URL saved successfully!');
    } catch (error) {
      console.error('Failed to save server config', error);
      Alert.alert('Error', 'Failed to save server URL');
    }
  };

  useEffect(() => {
    (async () => {
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

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use MediaTypeOptions.Images
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      setIsLoading(false);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
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
      
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 600 } }],
        { 
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG, 
          base64: true 
        }
      );
      
      if (manipResult.base64) {
        const sizeInKB = Math.round(manipResult.base64.length * 0.75 / 1024);
        console.log(`Compressed image size: ~${sizeInKB} KB`);
        
        if (sizeInKB > 500) {
          console.log("Image still large, compressing further...");
          const furtherCompressed = await ImageManipulator.manipulateAsync(
            manipResult.uri,
            [{ resize: { width: 400 } }],
            { 
              compress: 0.4,
              format: ImageManipulator.SaveFormat.JPEG, 
              base64: true 
            }
          );
          
          if (furtherCompressed.base64) {
            const newSizeInKB = Math.round(furtherCompressed.base64.length * 0.75 / 1024);
            console.log(`Further compressed image size: ~${newSizeInKB} KB`);
            setBase64Image(furtherCompressed.base64);
          } else {
            setBase64Image(manipResult.base64);
          }
        } else {
          setBase64Image(manipResult.base64);
        }
      } else {
        throw new Error("Failed to generate base64 from image");
      }
      
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

  const identifyPlant = async () => {
    if (!ngrokUrl) {
      Alert.alert(
        "Server URL Required",
        "Please enter your server URL first by clicking the settings icon in the top right corner.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (!base64Image) {
      Alert.alert("Error", "No image available. Please take a picture first.");
      return;
    }
    
    setIsLoading(true);
    
    const apiUrl = `http://${ngrokUrl}:3000/api/recommend`;
    
    const payload = {
      image: base64Image,
      location: { city: "New York" },
      userType: "Working Professional"
    };
    
    try {
      console.log("Sending request to:", apiUrl);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out after 60 seconds')), 60000)
      );

      const fetchPromise = fetch(apiUrl, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const data = await response.json();

      console.log("Response from server:", data);
      setIsLoading(false);

      if (data.error) {
          Alert.alert("Error", `Server error: ${data.error}`);
          return;
      }

      if (data.recommendations) {
        let plantList = data.recommendations;
        
        if (Array.isArray(plantList)) {
          const recommendationsText = plantList
            .map(rec => `• ${rec.name}: ${rec.description}`)
            .join('\n\n');
          
          Alert.alert(
            "Plant Recommendations",
            `Based on your image, here are some plants that would thrive in this space:\n\n${recommendationsText}`,
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Analysis Complete",
            `Response received but in unexpected format: ${JSON.stringify(data)}`,
            [{ text: "OK" }]
          );
        }
      } else {
        Alert.alert(
          "Analysis Complete",
          "We couldn't provide specific recommendations for this space. Please try with a clearer image.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during fetch:", error);
      Alert.alert("Error", error.message);
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
      
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setIsEditingUrl(true)}
      >
        <Ionicons name="settings-outline" size={24} color="#444" />
      </TouchableOpacity>
      
      {isEditingUrl && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Enter Server IP</ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Enter your computer's IP address where the server is running
            </ThemedText>
            
            <TextInput
              style={styles.input}
              value={ngrokUrl}
              onChangeText={setNgrokUrl}
              placeholder="e.g., 172.22.224.1"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingUrl(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => saveNgrokUrl(ngrokUrl)}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: capturedImage }} 
            style={styles.previewImage}
            resizeMode="contain"
          />
          
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
                  <ThemedText style={styles.actionText}>Analyze the Image</ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          {ngrokUrl ? (
            <ThemedText style={styles.serverConnectedText}>
              Server: {ngrokUrl}:3000
            </ThemedText>
          ) : (
            <ThemedText style={styles.serverNotConnectedText}>
              Server: Not connected - Set URL in settings
            </ThemedText>
          )}
          
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
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.5,
        }
    ),
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 350,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }
    ),
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#90EE90',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  serverConnectedText: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#4CD964',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  serverNotConnectedText: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 300,
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
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }
    ),
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
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 100,
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