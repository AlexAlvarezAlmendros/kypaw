/**
 * Servicio de Notificaciones (Simplificado)
 * 
 * Gestiona notificaciones locales con Expo Notifications:
 * - Una sola notificación por recordatorio
 * - Sin duplicados
 * - Reprogramación manual cuando se completa
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { ReminderType } from '../types';

// Subscriptions para listeners
let notificationReceivedSubscription: Notifications.Subscription | null = null;
let notificationResponseSubscription: Notifications.Subscription | null = null;

// Callback para cuando el usuario toca una notificación
type NotificationResponseCallback = (response: Notifications.NotificationResponse) => void;
let notificationResponseCallback: NotificationResponseCallback | null = null;

/**
 * Configurar el comportamiento de las notificaciones
 */
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const preferences = useNotificationStore.getState().preferences;
    
    // Verificar si las notificaciones están habilitadas
    if (!preferences.enabled) {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }
    
    // Verificar modo No Molestar
    const now = new Date();
    const isInDoNotDisturb = useNotificationStore.getState().isInDoNotDisturbPeriod(now);
    
    if (isInDoNotDisturb) {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: false,
        shouldShowList: true,
      };
    }
    
    // Verificar si el tipo de notificación está habilitado
    const data = notification.request.content.data;
    const type = data?.reminderType as ReminderType | undefined;
    
    if (type && !useNotificationStore.getState().isTypeEnabled(type)) {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: preferences.sound,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      useNotificationStore.getState().setPermissionStatus('denied');
      return false;
    }

    // Configurar canales en Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Recordatorios',
        description: 'Recordatorios de tu mascota',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
        enableVibrate: true,
        enableLights: true,
      });
    }

    useNotificationStore.getState().setPermissionStatus('granted');
    return true;
  } catch (error) {
    console.error('[Notifications] Error requesting permissions:', error);
    return false;
  }
};

/**
 * Obtener el canal de Android según el tipo
 */
const getChannelId = (type?: ReminderType): string => {
  return 'default';
};

/**
 * Calcular la próxima fecha de notificación según la frecuencia
 */
export const calculateNextNotificationDate = (
  baseDate: Date,
  frequency: string
): Date => {
  const now = new Date();
  let nextDate = new Date(baseDate);
  
  // Asegurar que la fecha base tenga la hora correcta
  const hour = baseDate.getHours();
  const minute = baseDate.getMinutes();
  
  switch (frequency) {
    case 'ONCE':
      // Para una vez, usar la fecha tal cual
      return nextDate;
      
    case 'EVERY_8_HOURS':
      // Encontrar la próxima ocurrencia cada 8 horas
      while (nextDate <= now) {
        nextDate = new Date(nextDate.getTime() + 8 * 60 * 60 * 1000);
      }
      return nextDate;
      
    case 'EVERY_12_HOURS':
      // Encontrar la próxima ocurrencia cada 12 horas
      while (nextDate <= now) {
        nextDate = new Date(nextDate.getTime() + 12 * 60 * 60 * 1000);
      }
      return nextDate;
      
    case 'DAILY':
      // Hoy a la hora especificada, o mañana si ya pasó
      nextDate.setHours(hour, minute, 0, 0);
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      return nextDate;
      
    case 'EVERY_TWO_DAYS':
      // Cada 2 días a la hora especificada
      nextDate.setHours(hour, minute, 0, 0);
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 2);
      }
      return nextDate;
      
    case 'EVERY_THREE_DAYS':
      // Cada 3 días a la hora especificada
      nextDate.setHours(hour, minute, 0, 0);
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 3);
      }
      return nextDate;
      
    case 'WEEKLY':
      // Mismo día de la semana a la hora especificada
      nextDate.setHours(hour, minute, 0, 0);
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      return nextDate;
      
    case 'MONTHLY':
      // Mismo día del mes a la hora especificada
      nextDate.setHours(hour, minute, 0, 0);
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      return nextDate;
      
    default:
      return nextDate;
  }
};

/**
 * Programar UNA SOLA notificación para un recordatorio
 * NO usa repeats - siempre programa una notificación única
 */
export const scheduleNotification = async (
  title: string,
  body: string,
  scheduledDate: Date,
  data?: { 
    reminderType?: ReminderType; 
    reminderId?: string; 
    petId?: string; 
    petName?: string;
    frequency?: string;
    [key: string]: any 
  }
): Promise<string | null> => {
  try {
    const preferences = useNotificationStore.getState().preferences;
    const type = data?.reminderType;
    
    // Verificar si las notificaciones están habilitadas
    if (!preferences.enabled) {
      console.log('[Notifications] Notifications disabled, skipping');
      return null;
    }
    
    // Verificar si el tipo está habilitado
    if (type && !useNotificationStore.getState().isTypeEnabled(type)) {
      console.log(`[Notifications] Type ${type} disabled, skipping`);
      return null;
    }
    
    // No programar si la fecha ya pasó
    if (scheduledDate <= new Date()) {
      console.log('[Notifications] Date is in the past, skipping');
      return null;
    }
    
    // Cancelar notificaciones anteriores del mismo reminderId
    if (data?.reminderId) {
      await cancelNotificationsByReminderId(data.reminderId);
    }
    
    const channelId = getChannelId(type);
    
    // Programar UNA notificación con fecha específica (sin repeats)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          ...data,
          scheduledAt: scheduledDate.toISOString(),
        },
        sound: preferences.sound,
        badge: 1,
      },
      trigger: {
        channelId,
        date: scheduledDate,
      },
    });

    console.log(`[Notifications] Scheduled: "${title}" for ${scheduledDate.toLocaleString()} (ID: ${notificationId})`);
    return notificationId;
  } catch (error: any) {
    console.error('[Notifications] Error scheduling:', error);
    return null;
  }
};

/**
 * Programar notificación recurrente
 * Calcula la próxima fecha y programa UNA SOLA notificación
 */
export const scheduleRecurringNotification = async (
  title: string,
  body: string,
  frequency: 'EVERY_8_HOURS' | 'EVERY_12_HOURS' | 'DAILY' | 'EVERY_TWO_DAYS' | 'EVERY_THREE_DAYS' | 'WEEKLY' | 'MONTHLY',
  hour: number,
  minute: number,
  data?: { 
    reminderType?: ReminderType; 
    reminderId?: string; 
    petId?: string; 
    petName?: string; 
    [key: string]: any 
  }
): Promise<string | null> => {
  try {
    // Crear fecha base con la hora especificada
    const baseDate = new Date();
    baseDate.setHours(hour, minute, 0, 0);
    
    // Calcular la próxima fecha según la frecuencia
    const nextDate = calculateNextNotificationDate(baseDate, frequency);
    
    // Programar una sola notificación
    return await scheduleNotification(
      title,
      body,
      nextDate,
      { ...data, frequency }
    );
  } catch (error: any) {
    console.error('[Notifications] Error scheduling recurring:', error);
    return null;
  }
};

/**
 * Cancelar una notificación programada
 */
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`[Notifications] Cancelled: ${notificationId}`);
  } catch (error: any) {
    console.error('[Notifications] Error cancelling:', error);
  }
};

/**
 * Cancelar todas las notificaciones programadas
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] Cancelled all notifications');
  } catch (error: any) {
    console.error('[Notifications] Error cancelling all:', error);
  }
};

/**
 * Cancelar notificaciones por reminderId
 */
export const cancelNotificationsByReminderId = async (reminderId: string): Promise<void> => {
  try {
    const scheduled = await getAllScheduledNotifications();
    const toCancel = scheduled.filter(
      (n) => n.content.data?.reminderId === reminderId
    );
    
    for (const n of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
    
    if (toCancel.length > 0) {
      console.log(`[Notifications] Cancelled ${toCancel.length} for reminder ${reminderId}`);
    }
  } catch (error) {
    console.error('[Notifications] Error cancelling by reminderId:', error);
  }
};

/**
 * Obtener todas las notificaciones programadas
 */
export const getAllScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error: any) {
    console.error('[Notifications] Error getting scheduled:', error);
    return [];
  }
};

/**
 * Enviar notificación inmediata (para testing)
 */
export const sendImmediateNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<string> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: null,
    });
    return notificationId;
  } catch (error: any) {
    console.error('[Notifications] Error sending immediate:', error);
    throw error;
  }
};

/**
 * Inicializar listeners de notificaciones
 */
export const initializeNotificationListeners = (
  onNotificationResponse?: NotificationResponseCallback
) => {
  // Limpiar listeners anteriores
  cleanupNotificationListeners();
  
  notificationResponseCallback = onNotificationResponse || null;
  
  // Escuchar notificaciones en primer plano (solo para logging)
  notificationReceivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('[Notifications] Received:', notification.request.content.title);
      // NO reprogramamos automáticamente aquí
      // La reprogramación se hace cuando el usuario completa el recordatorio
    }
  );
  
  // Escuchar cuando el usuario toca una notificación
  notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('[Notifications] Tapped:', response.notification.request.content.title);
      if (notificationResponseCallback) {
        notificationResponseCallback(response);
      }
    }
  );
  
  console.log('[Notifications] Listeners initialized');
};

/**
 * Limpiar listeners de notificaciones
 */
export const cleanupNotificationListeners = () => {
  if (notificationReceivedSubscription) {
    notificationReceivedSubscription.remove();
    notificationReceivedSubscription = null;
  }
  if (notificationResponseSubscription) {
    notificationResponseSubscription.remove();
    notificationResponseSubscription = null;
  }
  notificationResponseCallback = null;
};

/**
 * Verificar si los permisos están concedidos
 */
export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === 'granted';
    useNotificationStore.getState().setPermissionStatus(
      granted ? 'granted' : status === 'denied' ? 'denied' : 'undetermined'
    );
    return granted;
  } catch (error) {
    console.error('[Notifications] Error checking permissions:', error);
    return false;
  }
};

/**
 * Obtener el badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    return 0;
  }
};

/**
 * Establecer el badge
 */
export const setBadgeCount = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('[Notifications] Error setting badge:', error);
  }
};

/**
 * Limpiar el badge
 */
export const clearBadge = async (): Promise<void> => {
  await setBadgeCount(0);
};

/**
 * Obtener estadísticas de notificaciones
 */
export const getNotificationStats = async (): Promise<{
  total: number;
  byType: Record<string, number>;
  nextScheduled: Date | null;
}> => {
  try {
    const scheduled = await getAllScheduledNotifications();
    
    const byType: Record<string, number> = {};
    let nextScheduled: Date | null = null;
    
    for (const notification of scheduled) {
      const type = (notification.content.data?.reminderType as string) || 'OTHER';
      byType[type] = (byType[type] || 0) + 1;
      
      const trigger = notification.trigger;
      if (trigger && 'date' in trigger && trigger.date) {
        const triggerDate = new Date(trigger.date);
        if (!nextScheduled || triggerDate < nextScheduled) {
          nextScheduled = triggerDate;
        }
      }
    }
    
    return { total: scheduled.length, byType, nextScheduled };
  } catch (error) {
    return { total: 0, byType: {}, nextScheduled: null };
  }
};

/**
 * Debug: Listar todas las notificaciones programadas
 */
export const debugListScheduledNotifications = async (): Promise<void> => {
  const scheduled = await getAllScheduledNotifications();
  console.log(`[Notifications] Total scheduled: ${scheduled.length}`);
  scheduled.forEach((n, i) => {
    const trigger = n.trigger as any;
    const date = trigger?.date ? new Date(trigger.date).toLocaleString() : 'unknown';
    console.log(`  ${i + 1}. ${n.content.title} - ${date} (${n.identifier})`);
  });
};
