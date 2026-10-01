import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { formatCarat, formatNumber, formatDate, getTodayDateString } from '../../utils/formatters';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function TodayProductionCard({ todayRecords = [], onPress, onAddPress }) {
  const todayStr = getTodayDateString();
  const todayFormatted = formatDate(todayStr);

  const totalWeight = todayRecords.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  const count = todayRecords.length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="diamond-stone" size={14} color="#38BDF8" style={styles.sparkleIcon} />
          <Text style={styles.badgeText}>TODAY'S PRODUCTION</Text>
        </View>
        <Text style={styles.dateText}>{todayFormatted}</Text>
      </View>

      {/* Main Metrics */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Total Diamonds</Text>
          <Text style={styles.metricValue}>
            {formatNumber(count)} <Text style={styles.unitText}>Pcs</Text>
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Total Weight</Text>
          <Text style={[styles.metricValue, styles.weightValue]}>
            {formatCarat(totalWeight)}
          </Text>
        </View>
      </View>

      {/* Diamonds Preview chips if count > 0 */}
      {count > 0 ? (
        <View style={styles.chipsRow}>
          {todayRecords.slice(0, 4).map((item) => (
            <View key={item.id} style={styles.chip}>
              <Text style={styles.chipWeight}>{formatCarat(item.weight, false)} CT</Text>
              <Text style={styles.chipShape}>• {item.shape}</Text>
            </View>
          ))}
          {count > 4 ? (
            <View style={styles.moreChip}>
              <Text style={styles.moreChipText}>+{count - 4} more</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={styles.viewRecordsBtn}
        >
          <Text style={styles.viewRecordsText}>View today's records</Text>
          <Ionicons name="arrow-forward" size={14} color="#38BDF8" />
        </TouchableOpacity>

        {onAddPress && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddPress}
            style={styles.addBtn}
          >
            <Ionicons name="add" size={16} color={COLORS.white} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.premium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sparkleIcon: {
    marginRight: 6,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  dateText: {
    color: COLORS.subtle,
    fontSize: 12,
    ...FONTS.medium,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricCol: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
    marginHorizontal: 16,
  },
  metricLabel: {
    color: COLORS.subtle,
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 4,
  },
  metricValue: {
    color: COLORS.white,
    fontSize: 24,
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 14,
    color: COLORS.subtle,
    ...FONTS.regular,
  },
  weightValue: {
    color: '#38BDF8',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipWeight: {
    color: COLORS.white,
    fontSize: 11,
    ...FONTS.bold,
  },
  chipShape: {
    color: COLORS.subtle,
    fontSize: 10,
    marginLeft: 3,
    ...FONTS.regular,
  },
  moreChip: {
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  moreChipText: {
    color: COLORS.subtle,
    fontSize: 11,
    ...FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  viewRecordsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewRecordsText: {
    color: '#38BDF8',
    fontSize: 12,
    ...FONTS.semibold,
    marginRight: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 12,
    ...FONTS.bold,
    marginLeft: 2,
  },
});
