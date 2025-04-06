import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Default to localhost when running on web
const DEFAULT_SERVER_IP = Platform.OS === 'web' ? 'localhost' : '192.168.1.100';
const DEFAULT_SERVER_PORT = '3000';

export const getServerUrl = async () => {
  try {
    const savedIp = await AsyncStorage.getItem('serverIp');
    const savedPort = await AsyncStorage.getItem('serverPort');
    const ip = savedIp || DEFAULT_SERVER_IP;
    const port = savedPort || DEFAULT_SERVER_PORT;
    return `http://${ip}:${port}`;
  } catch (error) {
    console.error('Error getting server IP:', error);
    return `http://${DEFAULT_SERVER_IP}:${DEFAULT_SERVER_PORT}`;
  }
};

export const saveServerConfig = async (ip, port = DEFAULT_SERVER_PORT) => {
  try {
    await AsyncStorage.setItem('serverIp', ip);
    await AsyncStorage.setItem('serverPort', port);
    return true;
  } catch (error) {
    console.error('Error saving server config:', error);
    return false;
  }
};

// Add default export
export default { getServerUrl, saveServerConfig };