import { useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { create } from 'zustand';

interface ColorSchemeStore {
  /**
   * Modo de tema seleccionado por el usuario: 'light', 'dark', o 'auto'
   */
  themeMode: 'light' | 'dark' | 'auto';
  
  /**
   * Tema del sistema operativo actual
   */
  systemTheme: 'light' | 'dark';
  
  /**
   * Tema actual efectivo (considerando modo y sistema)
   */
  currentTheme: 'light' | 'dark';
  
  /**
   * Cambia el modo de tema
   */
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  
  /**
   * Actualiza el tema del sistema (llamado por el listener)
   */
  setSystemTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Helper para calcular el tema efectivo
 */
const calculateCurrentTheme = (
  themeMode: 'light' | 'dark' | 'auto',
  systemTheme: 'light' | 'dark'
): 'light' | 'dark' => {
  if (themeMode === 'auto') {
    return systemTheme;
  }
  return themeMode;
};

/**
 * Store para gestionar las preferencias de tema del usuario
 */
export const useColorSchemeStore = create<ColorSchemeStore>((set, get) => {
  const initialSystemTheme = Appearance.getColorScheme();
  const theme = initialSystemTheme === 'dark' ? 'dark' : 'light';
  
  return {
    themeMode: 'auto',
    systemTheme: theme,
    currentTheme: theme,
    
    setThemeMode: (mode) => {
      const { systemTheme } = get();
      const newTheme = calculateCurrentTheme(mode, systemTheme);
      set({
        themeMode: mode,
        currentTheme: newTheme,
      });
    },
    
    setSystemTheme: (theme) => {
      const { themeMode } = get();
      const newTheme = calculateCurrentTheme(themeMode, theme);
      set({
        systemTheme: theme,
        currentTheme: newTheme,
      });
    },
  };
});

// Listener global para cambios en el tema del sistema
Appearance.addChangeListener(({ colorScheme }) => {
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  useColorSchemeStore.getState().setSystemTheme(theme);
});

/**
 * Hook para obtener el esquema de color actual
 * Considera la preferencia del usuario y el tema del sistema
 * Se actualiza automáticamente cuando el sistema cambia de tema
 */
export const useAppColorScheme = () => {
  const currentTheme = useColorSchemeStore((state) => state.currentTheme);
  
  // Verificar el tema del sistema al montar el componente
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === 'dark' ? 'dark' : 'light';
    useColorSchemeStore.getState().setSystemTheme(theme);
  }, []);
  
  return currentTheme;
};
