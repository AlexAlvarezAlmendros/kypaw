import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Chip, Icon, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/theme';
import { VetVisit } from '../../types';
import { TodayItem } from '../../hooks/useTodayItems';

interface VisitItemProps {
  item: TodayItem;
  visitColor: string;
  onPress: (petId: string) => void;
  showConnectorLine: boolean;
}

const VisitItemComponent: React.FC<VisitItemProps> = ({
  item,
  visitColor,
  onPress,
  showConnectorLine,
}) => {
  const theme = useTheme();
  const visit = item.data as VetVisit;

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <Text style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>{item.time}</Text>
        <View style={[styles.timelineDot, { backgroundColor: visitColor }]} />
        {showConnectorLine && <View style={[styles.timelineLine, { backgroundColor: theme.colors.outlineVariant }]} />}
      </View>

      <TouchableOpacity
        style={[styles.reminderCard, { borderLeftColor: visitColor, backgroundColor: theme.colors.elevation.level1 }]}
        onPress={() => onPress(visit.petId)}
        activeOpacity={0.7}
      >
        <View style={styles.reminderHeader}>
          <View style={styles.reminderIconContainer}>
            <Icon source={item.icon} size={24} color={visitColor} />
          </View>
          <View style={styles.reminderContent}>
            <Text style={[styles.reminderTitle, { color: theme.colors.onSurface }]}>{item.title}</Text>
            {item.subtitle && (
              <Text style={[styles.reminderSubtitle, { color: theme.colors.onSurfaceVariant }]}>{item.subtitle}</Text>
            )}
          </View>
        </View>

        {visit.clinicName && (
          <Chip
            icon="hospital-building"
            style={[styles.frequencyChip, { backgroundColor: theme.colors.primaryContainer }]}
            textStyle={[styles.frequencyChipText, { color: theme.colors.onPrimaryContainer }]}
            compact
          >
            {visit.clinicName}
          </Chip>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const VisitItem = memo(VisitItemComponent);

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
  reminderSubtitle: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  frequencyChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  frequencyChipText: {
    fontSize: 12,
  },
});
