import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCarat, formatCurrency, formatMonthYear, formatDate } from '../../utils/formatters';
import { calculateMonthlyTotal, cleanFloat } from '../../utils/calculations';
import { useDiamond } from '../../context/DiamondContext';
import { COLORS, FONTS } from '../../constants/theme';

export default function MonthDetailsModal({
  visible,
  onClose,
  summary,
  onOpenCalculator,
}) {
  const { records } = useDiamond();

  if (!summary) return null;

  const monthLabel = formatMonthYear(summary.year, summary.month);
  const liveMonth = calculateMonthlyTotal(records, summary.month, summary.year);

  const depositedWeight =
    summary.depositedWeight !== undefined ? summary.depositedWeight : summary.totalWeight;
  const depositedDiamonds =
    summary.depositedDiamonds !== undefined ? summary.depositedDiamonds : summary.totalDiamonds;

  // Group records by day for breakdown
  const dailyBreakdown = (liveMonth.records || []).reduce((acc, rec) => {
    const d = rec.date;
    if (!acc[d]) {
      acc[d] = {
        date: d,
        count: 0,
        weight: 0,
        depositedCount: 0,
        depositedWeight: 0,
        diamonds: [],
      };
    }
    acc[d].count += 1;
    acc[d].weight = cleanFloat(acc[d].weight + (Number(rec.weight) || 0));
    if (rec.isDeposited) {
      acc[d].depositedCount += 1;
      acc[d].depositedWeight = cleanFloat(acc[d].depositedWeight + (Number(rec.weight) || 0));
    }
    acc[d].diamonds.push(rec);
    return acc;
  }, {});

  const sortedDays = Object.values(dailyBreakdown).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={monthLabel}
      subtitle={`Saved on ${formatDate(summary.savedAt)}`}
      position="bottom"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Deposited (Payable)</Text>
            <Text style={[styles.kpiVal, styles.depositedVal]}>{formatCarat(depositedWeight)}</Text>
            <Text style={styles.kpiSub}>{depositedDiamonds} Pcs</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Total Crafted</Text>
            <Text style={[styles.kpiVal, styles.weightVal]}>{formatCarat(summary.totalWeight)}</Text>
            <Text style={styles.kpiSub}>{summary.totalDiamonds} Pcs</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Rate / CT</Text>
            <Text style={styles.kpiVal}>₹{summary.pricePerCarat}</Text>
            <Text style={styles.kpiSub}>Agreed Price</Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Total Wages</Text>
            <Text style={[styles.kpiVal, styles.earningsVal]}>{formatCurrency(summary.totalAmount)}</Text>
            <Text style={styles.kpiSub}>Final Payout</Text>
          </View>
        </View>

        {/* Daily Breakdown Header */}
        <View style={styles.breakdownHeader}>
          <Text style={styles.breakdownTitle}>DAILY BREAKDOWN</Text>
          <Text style={styles.workingDaysText}>{sortedDays.length} working days</Text>
        </View>

        {/* Daily List */}
        {sortedDays.length === 0 ? (
          <View style={styles.emptyDays}>
            <Text style={styles.emptyDaysText}>No current diamond pieces logged for this month.</Text>
          </View>
        ) : (
          <View style={styles.daysList}>
            {sortedDays.map((day) => (
              <View key={day.date} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                  <Text style={styles.dayCount}>
                    {day.count} {day.count === 1 ? 'Piece' : 'Pieces'} • {day.depositedCount} Deposited
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.dayWeight}>{formatCarat(day.weight)}</Text>
                  {day.depositedWeight !== day.weight ? (
                    <Text style={styles.dayDepositedWeight}>{formatCarat(day.depositedWeight)} dep</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Notes if present */}
        {summary.notes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesContent}>{summary.notes}</Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Close"
            onPress={onClose}
            variant="secondary"
            size="md"
            style={styles.closeBtn}
          />
          {onOpenCalculator && (
            <Button
              title="Open Calculator"
              onPress={() => {
                onClose();
                onOpenCalculator(summary.month, summary.year);
              }}
              variant="primary"
              size="md"
              style={styles.calcBtn}
            />
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 480,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.divider,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  kpiItem: {
    width: '50%',
    padding: 8,
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.medium,
    marginBottom: 2,
  },
  kpiVal: {
    fontSize: 16,
    color: COLORS.primary,
    ...FONTS.black,
  },
  depositedVal: {
    color: '#059669',
  },
  weightVal: {
    color: COLORS.diamond,
  },
  earningsVal: {
    color: COLORS.success,
  },
  kpiSub: {
    fontSize: 10,
    color: COLORS.subtle,
    marginTop: 2,
    ...FONTS.medium,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  breakdownTitle: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  workingDaysText: {
    fontSize: 11,
    color: COLORS.subtle,
    ...FONTS.medium,
  },
  daysList: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  dayInfo: {
    flex: 1,
  },
  dayDate: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  dayCount: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  dayWeight: {
    fontSize: 15,
    color: COLORS.primary,
    ...FONTS.black,
  },
  dayDepositedWeight: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
    ...FONTS.bold,
  },
  emptyDays: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.divider,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyDaysText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  notesBox: {
    backgroundColor: COLORS.divider,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.bold,
    marginBottom: 2,
  },
  notesContent: {
    fontSize: 12,
    color: COLORS.primary,
    ...FONTS.regular,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
  },
  closeBtn: {
    flex: 1,
  },
  calcBtn: {
    flex: 1,
  },
});
