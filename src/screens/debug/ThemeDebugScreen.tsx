import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme, Button } from 'react-native-paper';
import { Appearance } from 'react-native';
import { useAppColorScheme, useColorSchemeStore } from '../../hooks/useColorScheme';

/**
 * Componente de depuración para verificar la detección del tema
 */
export default function ThemeDebugScreen() {
  const theme = useTheme();
  const currentTheme = useAppColorScheme();
  const { themeMode, systemTheme, setThemeMode, setSystemTheme } = useColorSchemeStore();
  const systemThemeFromAppearance = Appearance.getColorScheme();

  const forceRefreshSystemTheme = () => {
    const currentSystemTheme = Appearance.getColorScheme();
    const theme = currentSystemTheme === 'dark' ? 'dark' : 'light';
    setSystemTheme(theme);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.title}>
          Información del Tema
        </Text>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge" style={styles.label}>
            Tema del Sistema (Appearance):
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {systemThemeFromAppearance || 'no-preference'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge" style={styles.label}>
            Tema del Sistema (Store):
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {systemTheme}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge" style={styles.label}>
            Preferencia Usuario:
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {themeMode}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge" style={styles.label}>
            Tema Activo (Efectivo):
          </Text>
          <Text variant="bodyLarge" style={[styles.value, styles.highlight]}>
            {currentTheme}
          </Text>
        </View>

        <View style={styles.colorInfo}>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.primary }]}>
            <Text style={{ color: theme.colors.onPrimary }}>Primary</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary }]}>
            <Text style={{ color: theme.colors.onSecondary }}>Secondary</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.surface }]}>
            <Text style={{ color: theme.colors.onSurface }}>Surface</Text>
          </View>
        </View>

        <Button
          mode="outlined"
          onPress={forceRefreshSystemTheme}
          icon="refresh"
          style={{ marginTop: 16 }}
        >
          Forzar Actualización del Tema
        </Button>
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.title}>
          Cambiar Tema
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            mode={themeMode === 'light' ? 'contained' : 'outlined'}
            onPress={() => setThemeMode('light')}
            style={styles.button}
            icon="white-balance-sunny"
          >
            Claro
          </Button>

          <Button
            mode={themeMode === 'dark' ? 'contained' : 'outlined'}
            onPress={() => setThemeMode('dark')}
            style={styles.button}
            icon="moon-waning-crescent"
          >
            Oscuro
          </Button>

          <Button
            mode={themeMode === 'auto' ? 'contained' : 'outlined'}
            onPress={() => setThemeMode('auto')}
            style={styles.button}
            icon="theme-light-dark"
          >
            Automático
          </Button>
        </View>
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="bodyMedium" style={styles.helpText}>
          💡 Para probar el modo automático:
        </Text>
        <Text variant="bodySmall" style={styles.helpText}>
          • iOS: Ajustes → Pantalla y brillo → Apariencia
        </Text>
        <Text variant="bodySmall" style={styles.helpText}>
          • Android: Ajustes → Pantalla → Tema oscuro
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
  },
  highlight: {
    color: '#4F46E5',
  },
  colorInfo: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  colorBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonGroup: {
    gap: 8,
  },
  button: {
    marginVertical: 4,
  },
  helpText: {
    marginVertical: 4,
    opacity: 0.8,
  },
});
