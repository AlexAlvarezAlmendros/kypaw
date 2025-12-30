import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../constants/theme';
import { Card } from '../../components/ui';

const TodayScreen = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Capitalize primera letra
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola 👋</Text>
          <Text style={styles.date}>{capitalizedDate}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Tareas de Hoy</Text>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={80}
              color={colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>¡Todo tranquilo por aquí!</Text>
            <Text style={styles.emptySubtitle}>
              No tienes tareas programadas para hoy.{'\n'}
              Usa el botón + para agregar recordatorios.
            </Text>
          </View>

          {/* Sección de Accesos Rápidos */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
            <View style={styles.actionsGrid}>
              <Card
                style={styles.actionCard}
                onPress={() => {
                  // TODO: Navegar a añadir recordatorio
                }}
              >
                <View style={styles.actionContent}>
                  <MaterialCommunityIcons name="bell-plus" size={32} color={colors.primary} />
                  <Text style={styles.actionText}>Nueva Tarea</Text>
                </View>
              </Card>

              <Card
                style={styles.actionCard}
                onPress={() => {
                  // TODO: Navegar a añadir visita
                }}
              >
                <View style={styles.actionContent}>
                  <MaterialCommunityIcons name="hospital-box" size={32} color={colors.secondary} />
                  <Text style={styles.actionText}>Visita Vet.</Text>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // TODO: Abrir menú de opciones o navegar a añadir
        }}
        color={colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  greeting: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  body: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  quickActions: {
    marginTop: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionText: {
    ...typography.button,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});

export default TodayScreen;
