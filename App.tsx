import '@azure/core-asynciterator-polyfill';
import 'expo-crypto';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged, type Auth } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { useAuthStore } from './src/store/authStore';
import { lightTheme, darkTheme } from './src/config/paperTheme';
import { useAppColorScheme } from './src/hooks/useColorScheme';
import { initializeNotificationListeners, cleanupNotificationListeners, syncAllNotifications } from './src/services/notificationService';
import { initializePermissions } from './src/services/permissionsService';
import { DialogProvider } from './src/contexts/DialogContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const { user, setUser, setLoading } = useAuthStore();
  const colorScheme = useAppColorScheme();
  
  // Seleccionar tema según el esquema de color
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // Listener de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          createdAt: user.metadata.creationTime as any,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Inicializar listeners de notificaciones para reprogramación automática
  useEffect(() => {
    initializeNotificationListeners();
    
    return () => {
      cleanupNotificationListeners();
    };
  }, []);

  // Solicitar todos los permisos al inicio de la app
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const status = await initializePermissions();
        console.log('📱 Estado de permisos:', status);
      } catch (error) {
        console.error('Error solicitando permisos:', error);
      }
    };

    requestPermissions();
  }, []);

  // Sincronizar notificaciones cuando el usuario inicia sesión
  useEffect(() => {
    if (user?.uid) {
      const syncNotifications = async () => {
        try {
          console.log('🔄 Sincronizando notificaciones para usuario:', user.uid);
          await syncAllNotifications(user.uid);
        } catch (error) {
          console.error('Error sincronizando notificaciones:', error);
        }
      };

      // Sincronizar inmediatamente al iniciar sesión
      syncNotifications();

      // También sincronizar cada 12 horas mientras la app está en uso
      const syncInterval = setInterval(syncNotifications, 12 * 60 * 60 * 1000);

      return () => {
        clearInterval(syncInterval);
      };
    }
  }, [user?.uid]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DialogProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </DialogProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
