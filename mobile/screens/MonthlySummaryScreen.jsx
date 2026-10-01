import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDiamond } from '../context/DiamondContext';
import { calculateMonthlyTotal, calculateTotalAmount, cleanFloat } from '../utils/calculations';
import { formatCarat, formatCurrency, formatMonthYear, formatDate } from '../utils/formatters';
import { validatePricePerCarat } from '../utils/validation';
import Button from '../components/common/Button';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function MonthlySummaryScreen({ navigation, route }) {
  const { records, monthlySummaries, saveMonthlySummary } = useDiamond();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(route.params?.year || currentYear);
  const [selectedMonth, setSelectedMonth] = useState(route.params?.month || currentMonth);

  // Calculator State
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [depositedDiamonds, setDepositedDiamonds] = useState(0);
  const [depositedWeight, setDepositedWeight] = useState(0);
  const [monthRecords, setMonthRecords] = useState([]);
  const [pricePerCarat, setPricePerCarat] = useState('');
  const [priceError, setPriceError] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');

  const monthId = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const existingSummary = monthlySummaries.find((s) => s.id === monthId);

  useEffect(() => {
    if (existingSummary) {
      setPricePerCarat(String(existingSummary.pricePerCarat || ''));
      setSummaryNotes(existingSummary.notes || '');
    } else {
      setPricePerCarat('');
      setSummaryNotes('');
    }
    performCalculation();
  }, [selectedMonth, selectedYear, existingSummary, records]);

  const performCalculation = () => {
    const {
      totalWeight: weight,
      totalDiamonds: count,
      depositedWeight: depWeight,
      depositedDiamonds: depCount,
      records: mRecs,
    } = calculateMonthlyTotal(records, selectedMonth, selectedYear);
    setTotalWeight(weight);
    setTotalDiamonds(count);
    setDepositedWeight(depWeight);
    setDepositedDiamonds(depCount);
    setMonthRecords(mRecs);
  };

  const numericPrice = Number(pricePerCarat) || 0;
  const totalAmount = calculateTotalAmount(depositedWeight, numericPrice);
  const pendingWeight = cleanFloat(Math.max(0, totalWeight - depositedWeight));
  const pendingDiamonds = Math.max(0, totalDiamonds - depositedDiamonds);

  const handleSaveSummary = async () => {
    const validation = validatePricePerCarat(pricePerCarat);
    if (!validation.isValid) {
      setPriceError(validation.error);
      return;
    }

    await saveMonthlySummary({
      id: monthId,
      month: Number(selectedMonth),
      year: Number(selectedYear),
      totalDiamonds,
      totalWeight,
      depositedDiamonds,
      depositedWeight,
      pricePerCarat: Number(pricePerCarat),
      totalAmount,
      notes: summaryNotes,
    });
  };

  // Group by day for breakdown
  const dailyBreakdown = monthRecords.reduce((acc, rec) => {
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
  const monthName = formatMonthYear(selectedYear, selectedMonth);

  // Out of sync check
  const isOutOfSync =
    existingSummary &&
    (existingSummary.totalWeight !== totalWeight ||
      existingSummary.totalDiamonds !== totalDiamonds ||
      (existingSummary.depositedWeight !== undefined &&
        existingSummary.depositedWeight !== depositedWeight) ||
      (existingSummary.depositedDiamonds !== undefined &&
        existingSummary.depositedDiamonds !== depositedDiamonds));

  const months = [
    { num: 1, name: 'Jan' },
    { num: 2, name: 'Feb' },
    { num: 3, name: 'Mar' },
    { num: 4, name: 'Apr' },
    { num: 5, name: 'May' },
    { num: 6, name: 'Jun' },
    { num: 7, name: 'Jul' },
    { num: 8, name: 'Aug' },
    { num: 9, name: 'Sep' },
    { num: 10, name: 'Oct' },
    { num: 11, name: 'Nov' },
    { num: 12, name: 'Dec' },
  ];

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Monthly Summary</Text>
          <Text style={styles.subtitle}>Calculate monthly production and payroll</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          style={styles.historyBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="time" size={15} color={COLORS.diamond} />
          <Text style={styles.historyBtnText}>History ({monthlySummaries.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Mode Switcher */}
      <View style={styles.switcherContainer}>
        <View style={styles.switcherTrack}>
          <TouchableOpacity
            style={[styles.switcherTab, styles.switcherTabActive]}
            activeOpacity={0.9}
          >
            <Ionicons name="calculator" size={15} color={COLORS.diamond} />
            <Text style={[styles.switcherText, styles.switcherTextActive]}>Calculator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switcherTab}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={15} color={COLORS.muted} />
            <Text style={styles.switcherText}>
              Saved History ({monthlySummaries.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Month / Year Selector Card */}
          <View style={styles.selectorCard}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Select Month & Year</Text>
              <View style={styles.yearRow}>
                {years.map((y) => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setSelectedYear(y)}
                    style={[styles.yearChip, selectedYear === y && styles.yearChipActive]}
                  >
                    <Text style={[styles.yearChipText, selectedYear === y && styles.yearChipTextActive]}>
                      {y}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthScroll}
            >
              {months.map((m) => {
                const active = selectedMonth === m.num;
                return (
                  <TouchableOpacity
                    key={m.num}
                    onPress={() => setSelectedMonth(m.num)}
                    style={[styles.monthChip, active && styles.monthChipActive]}
                  >
                    <Text style={[styles.monthChipText, active && styles.monthChipTextActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Out of Sync Warning Banner */}
          {isOutOfSync ? (
            <View style={styles.syncBanner}>
              <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
              <View style={styles.syncTextCol}>
                <Text style={styles.syncTitle}>Saved Summary Outdated</Text>
                <Text style={styles.syncDesc}>
                  Underlying records were modified. Recalculate and re-save to sync earnings.
                </Text>
              </View>
            </View>
          ) : null}

          {/* Prominent Calculate Button */}
          <Button
            title={`Calculate Total for ${monthName}`}
            onPress={performCalculation}
            variant="luxury"
            size="lg"
            icon={<MaterialCommunityIcons name="calculator" size={20} color={COLORS.white} />}
            style={styles.calcBtn}
          />

          {/* Results Grid */}
          <View style={styles.resultCardsCol}>
            {/* Deposited Production Card (Payable) */}
            <View style={styles.kpiCardDeposited}>
              <View style={styles.kpiHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                  <Text style={styles.kpiLabelDeposited}>DEPOSITED PRODUCTION (PAYABLE)</Text>
                </View>
                <View style={styles.badgeDeposited}>
                  <Text style={styles.badgeTextDeposited}>{depositedDiamonds} Pcs</Text>
                </View>
              </View>
              <Text style={styles.weightValueDeposited}>{formatCarat(depositedWeight)}</Text>
              <Text style={styles.kpiFooterNote}>
                Confirmed deposited diamonds counted toward monthly earnings in {monthName}
              </Text>
            </View>

            {/* Total Weight Card (All Diamonds) */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Text style={styles.kpiLabel}>TOTAL PHYSICAL PRODUCTION</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalDiamonds} Pcs</Text>
                </View>
              </View>
              <Text style={styles.weightValue}>{formatCarat(totalWeight)}</Text>
              <Text style={styles.kpiFooterNote}>
                {pendingWeight > 0
                  ? `Pending deposit: ${formatCarat(pendingWeight)} (${pendingDiamonds} pcs)`
                  : `All ${totalDiamonds} diamonds deposited`}
              </Text>
            </View>

            {/* Price & Earnings Dark Card */}
            <View style={styles.earningsCard}>
              <View style={styles.kpiHeader}>
                <Text style={styles.earningsLabel}>PRICE CALCULATION</Text>
                <Text style={styles.formulaText}>Deposited Weight × Price/CT</Text>
              </View>

              {/* Price Per Carat Input */}
              <View style={styles.priceInputGroup}>
                <Text style={styles.priceLabel}>
                  Price Per Carat (₹ / CT) <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.priceInputWrapper, priceError && styles.priceErrorBorder]}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    value={pricePerCarat}
                    onChangeText={(val) => {
                      setPricePerCarat(val);
                      if (priceError) setPriceError('');
                    }}
                    placeholder="e.g. 500"
                    placeholderTextColor="#64748B"
                    keyboardType="numeric"
                    style={styles.priceInput}
                  />
                  <Text style={styles.perCtText}>/ CT</Text>
                </View>
                {priceError ? <Text style={styles.priceErrorText}>{priceError}</Text> : null}
              </View>

              {/* Calculated Total Amount Box */}
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>TOTAL EARNINGS (DEPOSITED ONLY)</Text>
                <Text style={styles.totalAmountVal}>{formatCurrency(totalAmount)}</Text>
                <Text style={styles.calculationPreview}>
                  {formatCarat(depositedWeight, false)} CT (Deposited) × ₹{numericPrice > 0 ? numericPrice : 0} = {formatCurrency(totalAmount)}
                </Text>
                {pendingWeight > 0 ? (
                  <Text style={styles.pendingExclusionNote}>
                    Note: {pendingDiamonds} undeposited piece{pendingDiamonds > 1 ? 's' : ''} ({formatCarat(pendingWeight)}) excluded until deposited.
                  </Text>
                ) : null}
              </View>

              {/* Save Summary Action Button */}
              <Button
                title={existingSummary ? 'Update Saved Monthly Summary' : 'Save Monthly Summary'}
                onPress={handleSaveSummary}
                variant="success"
                size="lg"
                disabled={totalDiamonds === 0}
                icon={<Ionicons name="checkmark-done" size={18} color={COLORS.white} />}
                style={styles.saveSummaryBtn}
              />

              {existingSummary ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('History')}
                  style={styles.viewInHistoryBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="time-outline" size={15} color={COLORS.diamond} />
                  <Text style={styles.viewInHistoryText}>View {monthName} in Saved History</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Daily Breakdown List */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>Daily Breakdown — {monthName}</Text>
              <Text style={styles.workingDaysText}>{sortedDays.length} working days</Text>
            </View>

            {sortedDays.length === 0 ? (
              <View style={styles.emptyBreakdown}>
                <Text style={styles.emptyBreakdownText}>
                  No diamond records logged in {monthName}.
                </Text>
              </View>
            ) : (
              <View style={styles.breakdownList}>
                {sortedDays.map((day) => (
                  <View key={day.date} style={styles.breakdownRow}>
                    <View>
                      <Text style={styles.breakdownDate}>{formatDate(day.date)}</Text>
                      <Text style={styles.breakdownPieces}>
                        {day.count} {day.count === 1 ? 'Piece' : 'Pieces'} • {day.depositedCount} Deposited
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.breakdownWeight}>{formatCarat(day.weight)}</Text>
                      {day.depositedWeight !== day.weight ? (
                        <Text style={styles.breakdownDepositedWeight}>
                          {formatCarat(day.depositedWeight)} dep
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    ...FONTS.black,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.diamondBg,
    borderWidth: 1,
    borderColor: COLORS.diamondBorder,
    gap: 5,
  },
  historyBtnText: {
    fontSize: 12,
    color: COLORS.diamond,
    ...FONTS.bold,
  },
  switcherContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  switcherTrack: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  switcherTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
    gap: 6,
  },
  switcherTabActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.subtle,
  },
  switcherText: {
    fontSize: 12,
    color: COLORS.muted,
    ...FONTS.semibold,
  },
  switcherTextActive: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
  viewInHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.3)',
    gap: 6,
  },
  viewInHistoryText: {
    fontSize: 13,
    color: '#38BDF8',
    ...FONTS.semibold,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  selectorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 13,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  yearRow: {
    flexDirection: 'row',
    gap: 6,
  },
  yearChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.divider,
  },
  yearChipActive: {
    backgroundColor: COLORS.primary,
  },
  yearChipText: {
    fontSize: 11,
    color: COLORS.secondary,
    ...FONTS.semibold,
  },
  yearChipTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  monthScroll: {
    gap: 8,
  },
  monthChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.divider,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  monthChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  monthChipText: {
    fontSize: 13,
    color: COLORS.secondary,
    ...FONTS.semibold,
  },
  monthChipTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  syncTextCol: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 13,
    color: COLORS.warning,
    ...FONTS.bold,
  },
  syncDesc: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 2,
  },
  calcBtn: {
    marginBottom: 16,
  },
  resultCardsCol: {
    gap: 14,
    marginBottom: 16,
  },
  kpiCardDeposited: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    ...SHADOWS.card,
  },
  kpiLabelDeposited: {
    fontSize: 11,
    color: '#15803D',
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  badgeDeposited: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  badgeTextDeposited: {
    fontSize: 11,
    color: '#15803D',
    ...FONTS.bold,
  },
  weightValueDeposited: {
    fontSize: 34,
    color: '#14532D',
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  kpiCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: COLORS.diamondBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.diamondBorder,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.diamond,
    ...FONTS.bold,
  },
  weightValue: {
    fontSize: 34,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  kpiFooterNote: {
    fontSize: 11,
    color: COLORS.subtle,
    marginTop: 6,
    ...FONTS.medium,
  },
  earningsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.premium,
  },
  earningsLabel: {
    fontSize: 11,
    color: '#38BDF8',
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  formulaText: {
    fontSize: 11,
    color: COLORS.subtle,
  },
  priceInputGroup: {
    marginTop: 14,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.subtle,
    ...FONTS.bold,
    marginBottom: 6,
  },
  required: {
    color: COLORS.danger,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 14,
    height: 50,
  },
  rupeeSymbol: {
    fontSize: 18,
    color: '#38BDF8',
    ...FONTS.bold,
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    color: COLORS.white,
    ...FONTS.black,
    paddingVertical: 0,
  },
  perCtText: {
    fontSize: 13,
    color: COLORS.subtle,
    ...FONTS.semibold,
  },
  priceErrorBorder: {
    borderColor: COLORS.danger,
  },
  priceErrorText: {
    color: '#FDA4AF',
    fontSize: 11,
    marginTop: 4,
    ...FONTS.medium,
  },
  totalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  totalLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  totalAmountVal: {
    fontSize: 28,
    color: '#34D399',
    ...FONTS.black,
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  calculationPreview: {
    fontSize: 11,
    color: COLORS.subtle,
    ...FONTS.medium,
  },
  pendingExclusionNote: {
    fontSize: 11,
    color: '#FCD34D',
    marginTop: 6,
    ...FONTS.medium,
  },
  saveSummaryBtn: {
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  workingDaysText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  emptyBreakdown: {
    padding: 20,
    alignItems: 'center',
  },
  emptyBreakdownText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  breakdownList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  breakdownDate: {
    fontSize: 13,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  breakdownPieces: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
  },
  breakdownWeight: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.black,
  },
  breakdownDepositedWeight: {
    fontSize: 11,
    color: '#059669',
    marginTop: 1,
    ...FONTS.bold,
  },
});
