/**
 * Servicio de Permisos
 * 
 * Centraliza la solicitud de todos los permisos necesarios al inicio de la app.
 * Permisos solicitados:
 * - Notificaciones
 * - Cámara
 * - Galería de fotos
 * - Ubicación
 */

import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Platform, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSIONS_REQUESTED_KEY = '@permissions_requested';

export interface PermissionStatus {
  notifications: boolean;
  camera: boolean;
  mediaLibrary: boolean;
  location: boolean;
}

/**
 * Verificar si ya se solicitaron los permisos anteriormente
 */
export const hasRequestedPermissions = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(PERMISSIONS_REQUESTED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
};

/**
 * Marcar que ya se solicitaron los permisos
 */
const markPermissionsRequested = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(PERMISSIONS_REQUESTED_KEY, 'true');
  } catch (error) {
    console.error('Error guardando estado de permisos:', error);
  }
};

/**
 * Obtener el estado actual de todos los permisos
 */
export const getPermissionsStatus = async (): Promise<PermissionStatus> => {
  const [notifications, camera, mediaLibrary, location] = await Promise.all([
    Notifications.getPermissionsAsync(),
    ImagePicker.getCameraPermissionsAsync(),
    ImagePicker.getMediaLibraryPermissionsAsync(),
    Location.getForegroundPermissionsAsync(),
  ]);

  return {
    notifications: notifications.status === 'granted',
    camera: camera.status === 'granted',
    mediaLibrary: mediaLibrary.status === 'granted',
    location: location.status === 'granted',
  };
};

/**
 * Solicitar permiso de notificaciones
 */
const requestNotificationsPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    
    // Configurar canales en Android
    if (status === 'granted' && Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Recordatorios',
        description: 'Recordatorios de medicación, citas y cuidados',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
        enableVibrate: true,
        enableLights: true,
      });
    }

    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de notificaciones:', error);
    return false;
  }
};

/**
 * Solicitar permiso de cámara
 */
const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await ImagePicker.getCameraPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de cámara:', error);
    return false;
  }
};

/**
 * Solicitar permiso de galería de fotos
 */
const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de galería:', error);
    return false;
  }
};

/**
 * Solicitar permiso de ubicación
 */
const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permiso de ubicación:', error);
    return false;
  }
};

/**
 * Solicitar todos los permisos necesarios
 * Se ejecuta al inicio de la app si no se han solicitado antes
 */
export const requestAllPermissions = async (): Promise<PermissionStatus> => {
  // Solicitar permisos secuencialmente para mejor UX
  const notifications = await requestNotificationsPermission();
  const camera = await requestCameraPermission();
  const mediaLibrary = await requestMediaLibraryPermission();
  const location = await requestLocationPermission();

  // Marcar que ya se solicitaron
  await markPermissionsRequested();

  return {
    notifications,
    camera,
    mediaLibrary,
    location,
  };
};

/**
 * Mostrar diálogo para abrir ajustes si se denegaron permisos
 */
export const showPermissionSettingsAlert = (permissionName: string): void => {
  Alert.alert(
    'Permiso necesario',
    `Para usar esta función, necesitas habilitar el permiso de ${permissionName} en los ajustes de la aplicación.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Abrir Ajustes', 
        onPress: () => Linking.openSettings() 
      },
    ]
  );
};

/**
 * Verificar y solicitar permisos al inicio de la app
 * Solo muestra el flujo de permisos la primera vez
 */
export const initializePermissions = async (): Promise<PermissionStatus> => {
  const alreadyRequested = await hasRequestedPermissions();
  
  if (alreadyRequested) {
    // Ya se solicitaron antes, solo retornar el estado actual
    return getPermissionsStatus();
  }

  // Primera vez, solicitar todos los permisos
  return requestAllPermissions();
};
