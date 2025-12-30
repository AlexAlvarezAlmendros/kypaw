import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

const HealthHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Salud</Text>
      <Text style={styles.subtitle}>TODO: Implementar historial médico</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default HealthHistoryScreen;
