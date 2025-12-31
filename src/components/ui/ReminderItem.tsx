import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox, Chip, Icon, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { Reminder } from '../../types';
import { TodayItem } from '../../hooks/useTodayItems';

interface ReminderItemProps {
  item: TodayItem;
  reminderColor: string;
  onToggleComplete: (reminderId: string) => void;
  showConnectorLine: boolean;
}

const ReminderItemComponent: React.FC<ReminderItemProps> = ({
  item,
  reminderColor,
  onToggleComplete,
  showConnectorLine,
}) => {
  const theme = useTheme();
  const reminder = item.data as Reminder;

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>{item.time}</Text>
        <View style={[styles.timelineDot, { backgroundColor: reminderColor }]} />
        {showConnectorLine && <View style={[styles.timelineLine, { backgroundColor: theme.colors.outlineVariant }]} />}
      </View>

      <TouchableOpacity
        style={[
          styles.reminderCard,
          { borderLeftColor: reminderColor, backgroundColor: theme.colors.elevation.level1 },
          item.completed && styles.reminderCardCompleted,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.reminderHeader}>
          <View style={styles.reminderIconContainer}>
            <Icon
              source={item.icon}
              size={24}
              color={reminderColor}
            />
          </View>
          <View style={styles.reminderContent}>
            <Text
              style={[
                styles.reminderTitle,
                { color: theme.colors.onSurface },
                item.completed && [styles.reminderTitleCompleted, { color: theme.colors.onSurfaceVariant }],
              ]}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={[styles.reminderSubtitle, { color: theme.colors.onSurfaceVariant }]}>{item.subtitle}</Text>
            )}
            {reminder.notes && (
              <Text style={[styles.reminderNotes, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                {reminder.notes}
              </Text>
            )}
          </View>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => onToggleComplete(reminder.id)}
            color={theme.colors.secondary}
          />
        </View>

        {reminder.frequency && reminder.frequency !== 'ONCE' && (
          <Chip
            icon="repeat"
            style={[styles.frequencyChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={[styles.frequencyChipText, { color: theme.colors.onPrimaryContainer }]}
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
};

export const ReminderItem = memo(ReminderItemComponent);

const styles = StyleSheet.create({
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  timelineLeft: {
    width: 60,
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  timeText: {
    fontSize: 14,
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
  },
  reminderCard: {
    flex: 1,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderCardCompleted: {
    opacity: 0.6,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reminderIconContainer: {
    marginRight: spacing.sm,
  },
  reminderContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  reminderTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  reminderSubtitle: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  reminderNotes: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  frequencyChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  frequencyChipText: {
    fontSize: 12,
  },
});
