import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

const PetDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Mascota</Text>
      <Text style={styles.subtitle}>TODO: Implementar detalle de mascota</Text>
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

export default PetDetailScreen;
