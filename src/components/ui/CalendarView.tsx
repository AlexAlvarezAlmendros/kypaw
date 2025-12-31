import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Icon, useTheme, ActivityIndicator } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { spacing } from '../../constants/theme';
import { ReminderItem } from './ReminderItem';
import { VisitItem } from './VisitItem';
import { TodayItem } from '../../hooks/useTodayItems';
import { Reminder, VetVisit } from '../../types';
import { CalendarMarkedDates } from '../../hooks/useCalendarItems';

// Configurar locale en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

interface CalendarViewProps {
  markedDates: CalendarMarkedDates;
  selectedDate: string;
  selectedDateItems: TodayItem[];
  loading: boolean;
  refreshing: boolean;
  onDateSelect: (date: string) => void;
  onRefresh: () => void;
  onToggleComplete: (reminderId: string) => void;
  onVisitPress: (petId: string) => void;
  onEditReminder?: (reminderId: string) => void;
  onDeleteReminder?: (reminderId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  markedDates,
  selectedDate,
  selectedDateItems,
  loading,
  refreshing,
  onDateSelect,
  onRefresh,
  onToggleComplete,
  onVisitPress,
  onEditReminder,
  onDeleteReminder,
}) => {
  const theme = useTheme();

  const getReminderColor = useCallback((type: string): string => {
    switch (type) {
      case 'MEDICATION':
        return theme.colors.primary;
      case 'HYGIENE':
        return theme.colors.secondary;
      case 'FOOD':
        return '#F59E0B';
      case 'VISIT':
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  }, [theme]);

  // Formatear la fecha seleccionada para mostrar
  const formattedSelectedDate = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [selectedDate]);

  // Configuración de tema para el calendario
  const calendarTheme = useMemo(() => ({
    backgroundColor: theme.colors.background,
    calendarBackground: theme.colors.surface,
    textSectionTitleColor: theme.colors.onSurfaceVariant,
    selectedDayBackgroundColor: theme.colors.primary,
    selectedDayTextColor: theme.colors.onPrimary,
    todayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.onSurface,
    textDisabledColor: theme.colors.onSurfaceVariant,
    dotColor: theme.colors.primary,
    selectedDotColor: theme.colors.onPrimary,
    arrowColor: theme.colors.primary,
    monthTextColor: theme.colors.onSurface,
    indicatorColor: theme.colors.primary,
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '500' as const,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  }), [theme]);

  const handleDayPress = useCallback((day: { dateString: string }) => {
    onDateSelect(day.dateString);
  }, [onDateSelect]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Calendario */}
      <View style={[styles.calendarContainer, { backgroundColor: theme.colors.surface }]}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="multi-dot"
          theme={calendarTheme}
          firstDay={1}
          enableSwipeMonths
          style={styles.calendar}
        />
      </View>

      {/* Sección de eventos del día seleccionado */}
      <View style={styles.eventsSection}>
        <Text style={[styles.dateTitle, { color: theme.colors.onSurface }]}>
          {formattedSelectedDate}
        </Text>

        {selectedDateItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              source="calendar-blank"
              size={48}
              color={theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No hay eventos para este día
            </Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {selectedDateItems.map((item, index) => {
              if (item.type === 'reminder') {
                const reminder = item.data as Reminder;
                const reminderColor = getReminderColor(reminder.type);

                return (
                  <ReminderItem
                    key={`reminder-${item.id}`}
                    item={item}
                    reminderColor={reminderColor}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditReminder}
                    onDelete={onDeleteReminder}
                    showConnectorLine={index < selectedDateItems.length - 1}
                  />
                );
              } else {
                const visit = item.data as VetVisit;
                const visitColor = getReminderColor('VISIT');

                return (
                  <VisitItem
                    key={`visit-${item.id}`}
                    item={item}
                    visitColor={visitColor}
                    onPress={onVisitPress}
                    showConnectorLine={index < selectedDateItems.length - 1}
                  />
                );
              }
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    margin: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 16,
  },
  eventsSection: {
    padding: spacing.lg,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  timeline: {
    marginBottom: spacing.lg,
  },
});

export default CalendarView;
