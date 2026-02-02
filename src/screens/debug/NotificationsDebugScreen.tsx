/**
 * Pantalla de Debug de Notificaciones
 * 
 * Permite verificar el estado de las notificaciones programadas
 * y forzar sincronización manual
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Divider, useTheme, List } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import {
  getAllScheduledNotifications,
  getNotificationStats,
  syncAllNotifications,
  debugListScheduledNotifications,
  sendImmediateNotification,
  requestNotificationPermissions,
} from '../../services/notificationService';
import { spacing } from '../../constants/theme';

export default function NotificationsDebugScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await getNotificationStats();
      const scheduled = await getAllScheduledNotifications();
      setStats(statsData);
      setNotifications(scheduled);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    try {
      setLoading(true);
      await syncAllNotifications(user.uid);
      Alert.alert('Éxito', 'Notificaciones sincronizadas');
      await loadStats();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al sincronizar');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert('Error', 'Permisos de notificaciones no concedidos');
        return;
      }

      await sendImmediateNotification(
        'Notificación de Prueba',
        'Esta es una notificación inmediata para verificar que funciona correctamente'
      );
      Alert.alert('Éxito', 'Notificación de prueba enviada');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al enviar notificación');
    }
  };

  const handleDebugLog = async () => {
    await debugListScheduledNotifications();
    Alert.alert('Debug', 'Revisa la consola para ver el log de notificaciones');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Estado de Notificaciones
      </Text>

      {/* Estadísticas */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            📊 Estadísticas
          </Text>
          <Divider style={styles.divider} />
          
          <View style={styles.stat}>
            <Text variant="bodyLarge">Total programadas:</Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
              {stats?.total || 0}
            </Text>
          </View>

          {stats?.nextScheduled && (
            <View style={styles.stat}>
              <Text variant="bodyLarge">Próxima notificación:</Text>
              <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {formatDate(stats.nextScheduled)}
              </Text>
            </View>
          )}

          {stats?.byType && Object.keys(stats.byType).length > 0 && (
            <>
              <Text variant="titleSmall" style={[styles.cardTitle, { marginTop: 16 }]}>
                Por tipo:
              </Text>
              {Object.entries(stats.byType).map(([type, count]) => (
                <View key={type} style={styles.stat}>
                  <Text variant="bodyMedium">{type}:</Text>
                  <Text variant="bodyMedium">{count as number}</Text>
                </View>
              ))}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Lista de notificaciones */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            🔔 Notificaciones Programadas
          </Text>
          <Divider style={styles.divider} />
          
          {notifications.length === 0 ? (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              No hay notificaciones programadas
            </Text>
          ) : (
            notifications.slice(0, 10).map((notification, index) => {
              const trigger = notification.trigger as any;
              const date = trigger?.date ? new Date(trigger.date) : null;
              const data = notification.content.data || {};
              
              return (
                <List.Item
                  key={notification.identifier}
                  title={notification.content.title}
                  description={date ? formatDate(date) : 'Sin fecha'}
                  left={(props) => <List.Icon {...props} icon="bell" />}
                  right={(props) => (
                    <Text {...props} variant="bodySmall" style={{ color: theme.colors.primary }}>
                      {data.reminderType || 'N/A'}
                    </Text>
                  )}
                  style={styles.listItem}
                />
              );
            })
          )}
          
          {notifications.length > 10 && (
            <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
              ... y {notifications.length - 10} más
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Acciones */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            🛠️ Acciones
          </Text>
          <Divider style={styles.divider} />
          
          <Button
            mode="contained"
            onPress={handleSync}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="sync"
          >
            Sincronizar Notificaciones
          </Button>

          <Button
            mode="outlined"
            onPress={handleTestNotification}
            style={styles.button}
            icon="send"
          >
            Enviar Notificación de Prueba
          </Button>

          <Button
            mode="outlined"
            onPress={loadStats}
            loading={loading}
            disabled={loading}
            style={styles.button}
            icon="refresh"
          >
            Recargar Estadísticas
          </Button>

          <Button
            mode="text"
            onPress={handleDebugLog}
            style={styles.button}
            icon="console"
          >
            Ver Log en Consola
          </Button>
        </Card.Content>
      </Card>

      <Text variant="bodySmall" style={styles.footer}>
        💡 Tip: Si no recibes notificaciones, verifica los permisos del sistema
        y que la app no esté en modo "No molestar"
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
  },
  listItem: {
    paddingHorizontal: 0,
  },
  footer: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: spacing.md,
  },
});
