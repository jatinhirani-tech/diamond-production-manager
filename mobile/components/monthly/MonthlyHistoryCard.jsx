import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCarat, formatCurrency, formatMonthYear, formatDate } from '../../utils/formatters';
import { calculateMonthlyTotal } from '../../utils/calculations';
import { useDiamond } from '../../context/DiamondContext';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function MonthlyHistoryCard({
  summary,
  onPress,
  onDelete,
  onRecalculate,
}) {
  const { records } = useDiamond();
  const monthLabel = formatMonthYear(summary.year, summary.month);

  // Check if live records have changed compared to the saved summary
  const liveTotals = calculateMonthlyTotal(records, summary.month, summary.year);
  const isOutOfSync =
    liveTotals.totalWeight !== summary.totalWeight ||
    liveTotals.totalDiamonds !== summary.totalDiamonds ||
    (summary.depositedWeight !== undefined &&
      summary.depositedWeight !== liveTotals.depositedWeight) ||
    (summary.depositedDiamonds !== undefined &&
      summary.depositedDiamonds !== liveTotals.depositedDiamonds);

  const depositedWeight =
    summary.depositedWeight !== undefined ? summary.depositedWeight : summary.totalWeight;
  const depositedDiamonds =
    summary.depositedDiamonds !== undefined ? summary.depositedDiamonds : summary.totalDiamonds;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress && onPress(summary)}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.monthTitle}>{monthLabel}</Text>
          <Text style={styles.savedDate}>Saved on {formatDate(summary.savedAt)}</Text>
        </View>

        <View style={styles.headerActions}>
          {isOutOfSync && onRecalculate ? (
            <TouchableOpacity
              onPress={() => onRecalculate(summary)}
              style={styles.syncBadge}
              activeOpacity={0.7}
            >
              <Ionicons name="sync" size={12} color={COLORS.warning} />
              <Text style={styles.syncText}>Sync</Text>
            </TouchableOpacity>
          ) : null}

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(summary)}
              style={styles.deleteBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Production & Earnings Details */}
      <View style={styles.body}>
        <View style={styles.productionSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.label}>DEPOSITED (PAYABLE)</Text>
              <Text style={styles.weightValueDeposited}>{formatCarat(depositedWeight)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.label}>TOTAL CRAFTED</Text>
              <Text style={styles.weightValue}>{formatCarat(summary.totalWeight)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rateRow}>
          <View style={styles.rateCol}>
            <Text style={styles.label}>RATE / CT</Text>
            <Text style={styles.rateVal}>₹{summary.pricePerCarat}</Text>
          </View>
          <View style={styles.rateColRight}>
            <Text style={styles.label}>TOTAL EARNINGS</Text>
            <Text style={styles.earningsVal}>{formatCurrency(summary.totalAmount)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.diamondsCountRow}>
          <MaterialCommunityIcons name="diamond-stone" size={14} color={COLORS.diamond} />
          <Text style={styles.diamondsCountText}>
            {summary.totalDiamonds} Diamonds ({depositedDiamonds} Deposited)
          </Text>
        </View>

        <View style={styles.viewDetailsRow}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.diamond} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  monthTitle: {
    fontSize: 18,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: -0.3,
  },
  savedDate: {
    fontSize: 11,
    color: COLORS.subtle,
    marginTop: 2,
    ...FONTS.medium,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  syncText: {
    fontSize: 11,
    color: COLORS.warning,
    ...FONTS.bold,
  },
  deleteBtn: {
    padding: 4,
  },
  body: {
    paddingVertical: 12,
  },
  productionSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: COLORS.muted,
    ...FONTS.bold,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  weightValue: {
    fontSize: 22,
    color: COLORS.secondary,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  weightValueDeposited: {
    fontSize: 26,
    color: '#059669',
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  rateCol: {
    flex: 1,
  },
  rateColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rateVal: {
    fontSize: 16,
    color: COLORS.secondary,
    ...FONTS.bold,
  },
  earningsVal: {
    fontSize: 18,
    color: COLORS.success,
    ...FONTS.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  diamondsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  diamondsCountText: {
    fontSize: 12,
    color: COLORS.muted,
    ...FONTS.medium,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.diamond,
    ...FONTS.bold,
  },
});
