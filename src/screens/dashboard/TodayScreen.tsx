import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FAB, Checkbox, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';
import { colors, typography, spacing } from '../../constants/theme';
import { Card } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { usePetStore } from '../../store/petStore';
import { getTodayReminders, completeReminder, deleteReminder } from '../../services/reminderService';
import { getUserVisits } from '../../services/vetVisitService';
import { cancelNotification } from '../../services/notificationService';
import { Reminder, VetVisit, RootStackParamList } from '../../types';

type TodayScreenProp = NativeStackNavigationProp<RootStackParamList>;

type TodayItem = {
  id: string;
  type: 'reminder' | 'visit';
  timestamp: Date;
  data: Reminder | VetVisit;
};

const getReminderIcon = (type: string) => {
  switch (type) {
    case 'MEDICATION':
      return 'pill';
    case 'HYGIENE':
      return 'shower';
    case 'FOOD':
      return 'food-drumstick';
    case 'VISIT':
      return 'hospital-box';
    default:
      return 'bell';
  }
};

const getReminderColor = (type: string) => {
  switch (type) {
    case 'MEDICATION':
      return colors.primary;
    case 'HYGIENE':
      return '#10B981';
    case 'FOOD':
      return '#F59E0B';
    case 'VISIT':
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

const TodayScreen = () => {
  const navigation = useNavigation<TodayScreenProp>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const pets = usePetStore((state) => state.pets);

  const [todayItems, setTodayItems] = useState<TodayItem[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Capitalize primera letra
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useFocusEffect(
    useCallback(() => {
      loadTodayData();
    }, [user])
  );

  const loadTodayData = async () => {
    if (!user) {
      setTodayItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Cargar recordatorios de hoy
      const todayReminders = await getTodayReminders(user.uid);
      
      // Cargar todas las visitas del usuario
      const allVisits = await getUserVisits(user.uid);
      
      // Filtrar visitas de hoy
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      
      const todayVisits = allVisits.filter((visit) => {
        const visitDate = visit.date.toDate();
        return visitDate >= startOfDay && visitDate <= endOfDay;
      });
      
      // Combinar en un solo array con tipo
      const items: TodayItem[] = [
        ...todayReminders.map((reminder) => ({
          id: reminder.id,
          type: 'reminder' as const,
          timestamp: reminder.scheduledAt.toDate(),
          data: reminder,
        })),
        ...todayVisits.map((visit) => ({
          id: visit.id,
          type: 'visit' as const,
          timestamp: visit.date.toDate(),
          data: visit,
        })),
      ];
      
      // Ordenar por hora
      items.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      setTodayItems(items);
    } catch (error: any) {
      console.error('Error al cargar datos de hoy:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas del día');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = async (reminderId: string, notificationId?: string) => {
    if (!user) return;

    try {
      await completeReminder(user.uid, reminderId);

      // Cancelar notificación si existe
      if (notificationId) {
        await cancelNotification(notificationId);
      }

      // Recargar datos para actualizar la vista
      await loadTodayData();
    } catch (error: any) {
      console.error('Error al completar recordatorio:', error);
      Alert.alert('Error', 'No se pudo completar el recordatorio');
    }
  };

  const handleDeleteReminder = (reminder: Reminder) => {
    Alert.alert(
      'Eliminar Recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmDeleteReminder(reminder),
        },
      ]
    );
  };

  const confirmDeleteReminder = async (reminder: Reminder) => {
    if (!user) return;

    try {
      await deleteReminder(user.uid, reminder.id);

      // Cancelar notificación si existe
      if (reminder.notificationId) {
        await cancelNotification(reminder.notificationId);
      }

      // Recargar datos para actualizar la vista
      await loadTodayData();
    } catch (error: any) {
      console.error('Error al eliminar recordatorio:', error);
      Alert.alert('Error', 'No se pudo eliminar el recordatorio');
    }
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet?.name || 'Mascota';
  };

  const formatTime = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={styles.greeting}>Hola 👋</Text>
          <Text style={styles.date}>{capitalizedDate}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Tareas de Hoy</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : todayItems.length === 0 ? (
            /* Empty State */
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
          ) : (
            /* Timeline de Tareas */
            <View style={styles.timeline}>
              {todayItems.map((item) => {
                if (item.type === 'reminder') {
                  const reminder = item.data as Reminder;
                  return (
                    <View key={`reminder-${item.id}`} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <Text style={styles.timeText}>{formatTime(reminder.scheduledAt)}</Text>
                        <View style={[styles.timelineDot, { backgroundColor: getReminderColor(reminder.type) }]} />
                        <View style={styles.timelineLine} />
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.reminderCard,
                          { borderLeftColor: getReminderColor(reminder.type) },
                          reminder.completed && styles.reminderCardCompleted
                        ]}
                        onLongPress={() => handleDeleteReminder(reminder)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.reminderHeader}>
                          <View style={styles.reminderIconContainer}>
                            <MaterialCommunityIcons
                              name={getReminderIcon(reminder.type)}
                              size={24}
                              color={getReminderColor(reminder.type)}
                            />
                          </View>
                          <View style={styles.reminderContent}>
                            <Text style={[styles.reminderTitle, reminder.completed && styles.reminderTitleCompleted]}>
                              {reminder.title}
                            </Text>
                            <Text style={styles.reminderSubtitle}>{getPetName(reminder.petId)}</Text>
                            {reminder.notes && (
                              <Text style={styles.reminderNotes} numberOfLines={2}>
                                {reminder.notes}
                              </Text>
                            )}
                          </View>
                          <Checkbox
                            status={reminder.completed ? 'checked' : 'unchecked'}
                            onPress={() => handleCompleteReminder(reminder.id, reminder.notificationId)}
                            color={colors.secondary}
                          />
                        </View>

                        {reminder.frequency && reminder.frequency !== 'ONCE' && (
                          <Chip
                            icon="repeat"
                            style={styles.frequencyChip}
                            textStyle={styles.frequencyChipText}
                            compact
                          >
                            {reminder.frequency === 'DAILY' && 'Diaria'}
                            {reminder.frequency === 'WEEKLY' && 'Semanal'}
                            {reminder.frequency === 'MONTHLY' && 'Mensual'}
                          </Chip>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  // Visita veterinaria
                  const visit = item.data as VetVisit;
                  return (
                    <View key={`visit-${item.id}`} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <Text style={styles.timeText}>{formatTime(visit.date)}</Text>
                        <View style={[styles.timelineDot, { backgroundColor: getReminderColor('VISIT') }]} />
                        <View style={styles.timelineLine} />
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.reminderCard,
                          { borderLeftColor: getReminderColor('VISIT') }
                        ]}
                        onPress={() => {
                          // Navegar al detalle de la visita
                          navigation.navigate('Pets');
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.reminderHeader}>
                          <View style={styles.reminderIconContainer}>
                            <MaterialCommunityIcons
                              name={getReminderIcon('VISIT')}
                              size={24}
                              color={getReminderColor('VISIT')}
                            />
                          </View>
                          <View style={styles.reminderContent}>
                            <Text style={styles.reminderTitle}>Visita Veterinaria</Text>
                            <Text style={styles.reminderSubtitle}>{getPetName(visit.petId)}</Text>
                            <Text style={styles.reminderNotes} numberOfLines={1}>
                              {visit.reason}
                            </Text>
                          </View>
                        </View>

                        {visit.clinicName && (
                          <Chip
                            icon="hospital-building"
                            style={styles.frequencyChip}
                            textStyle={styles.frequencyChipText}
                            compact
                          >
                            {visit.clinicName}
                          </Chip>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddReminder', {})}
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
    paddingBottom: spacing.xl * 2,
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
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
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
  timeline: {
    marginBottom: spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 60,
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    minHeight: 20,
  },
  reminderCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reminderCardCompleted: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  reminderTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  reminderSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  reminderNotes: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
    fontStyle: 'italic',
  },
  frequencyChip: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  frequencyChipText: {
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
});

export default TodayScreen;
