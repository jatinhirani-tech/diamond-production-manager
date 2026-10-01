import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDiamond } from '../context/DiamondContext';
import {
  calculateLifetimeProduction,
  calculateLifetimeEarnings,
  calculateMonthlyTotal,
  calculateTotalAmount,
} from '../utils/calculations';
import { formatCarat, formatCurrency, formatNumber } from '../utils/formatters';
import MonthlyHistoryCard from '../components/monthly/MonthlyHistoryCard';
import MonthDetailsModal from '../components/monthly/MonthDetailsModal';
import DeleteConfirmModal from '../components/records/DeleteConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function MonthlyHistoryScreen({ navigation }) {
  const { records, monthlySummaries, deleteMonthlySummary, updateMonthlySummary } = useDiamond();

  const [selectedSummary, setSelectedSummary] = useState(null);
  const [deletingSummary, setDeletingSummary] = useState(null);

  // Lifetime Statistics (Section 23 & 31)
  const lifetimeProduction = useMemo(
    () => calculateLifetimeProduction(monthlySummaries),
    [monthlySummaries]
  );
  const lifetimeEarnings = useMemo(
    () => calculateLifetimeEarnings(monthlySummaries),
    [monthlySummaries]
  );

  const handleRecalculateMonth = (summary) => {
    const live = calculateMonthlyTotal(records, summary.month, summary.year);
    const newAmount = calculateTotalAmount(live.depositedWeight, summary.pricePerCarat);

    updateMonthlySummary(summary.id, {
      totalWeight: live.totalWeight,
      totalDiamonds: live.totalDiamonds,
      depositedWeight: live.depositedWeight,
      depositedDiamonds: live.depositedDiamonds,
      totalAmount: newAmount,
    });
  };

  const renderHeader = () => (
    <View style={styles.headerArea}>
      {/* Lifetime Stats Card */}
      <View style={styles.lifetimeCard}>
        <View style={styles.lifetimeHeader}>
          <View style={styles.lifetimeBadge}>
            <MaterialCommunityIcons name="trophy-outline" size={14} color="#34D399" />
            <Text style={styles.lifetimeBadgeText}>LIFETIME TOTALS</Text>
          </View>
          <Text style={styles.archivesCountText}>
            {monthlySummaries.length} {monthlySummaries.length === 1 ? 'Month saved' : 'Months saved'}
          </Text>
        </View>

        <View style={styles.lifetimeRow}>
          <View style={styles.lifetimeCol}>
            <Text style={styles.lifetimeLabel}>TOTAL PRODUCTION</Text>
            <Text style={styles.lifetimeWeight}>{formatCarat(lifetimeProduction)}</Text>
          </View>
          <View style={styles.lifetimeDivider} />
          <View style={styles.lifetimeCol}>
            <Text style={styles.lifetimeLabel}>TOTAL EARNINGS</Text>
            <Text style={styles.lifetimeEarnings}>{formatCurrency(lifetimeEarnings)}</Text>
          </View>
        </View>
      </View>

      {/* Archives Title */}
      <View style={styles.listTitleRow}>
        <Text style={styles.listTitle}>Saved Monthly Closures</Text>
        <Text style={styles.listOrderHint}>Newest First</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar */}
      <View style={styles.appBar}>
        <View style={styles.titleRow}>
          {navigation.canGoBack() ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null}
          <View>
            <Text style={styles.title}>Monthly History</Text>
            <Text style={styles.subtitle}>Archived closures and lifetime earnings</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Monthly')}
          style={styles.calcBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="calculator-outline" size={16} color={COLORS.white} />
          <Text style={styles.calcBtnText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Mode Switcher */}
      <View style={styles.switcherContainer}>
        <View style={styles.switcherTrack}>
          <TouchableOpacity
            style={styles.switcherTab}
            onPress={() => navigation.navigate('Monthly')}
            activeOpacity={0.7}
          >
            <Ionicons name="calculator-outline" size={15} color={COLORS.muted} />
            <Text style={styles.switcherText}>Calculator</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.switcherTab, styles.switcherTabActive]}
            activeOpacity={0.9}
          >
            <Ionicons name="time" size={15} color={COLORS.diamond} />
            <Text style={[styles.switcherText, styles.switcherTextActive]}>
              Saved History ({monthlySummaries.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List of Archived Months */}
      <FlatList
        data={monthlySummaries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <MonthlyHistoryCard
            summary={item}
            onPress={(s) => setSelectedSummary(s)}
            onDelete={(s) => setDeletingSummary(s)}
            onRecalculate={handleRecalculateMonth}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            iconName="calendar-clock"
            title="No monthly summaries yet"
            description="Complete and save your first monthly calculation to see your monthly earnings history here."
            actionTitle="Go to Calculator"
            onAction={() => navigation.navigate('Monthly')}
          />
        }
      />

      {/* Month Details Breakdown Bottom Sheet */}
      <MonthDetailsModal
        visible={Boolean(selectedSummary)}
        onClose={() => setSelectedSummary(null)}
        summary={selectedSummary}
        onOpenCalculator={(m, y) => navigation.navigate('Monthly', { month: m, year: y })}
      />

      {/* Delete Monthly Summary Confirmation Modal */}
      <DeleteConfirmModal
        visible={Boolean(deletingSummary)}
        onClose={() => setDeletingSummary(null)}
        onConfirm={() => {
          if (deletingSummary) deleteMonthlySummary(deletingSummary.id);
        }}
        isMonthlySummary={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
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
  switcherContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
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
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  calcBtnText: {
    color: COLORS.white,
    fontSize: 12,
    ...FONTS.bold,
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  headerArea: {
    marginBottom: 8,
  },
  lifetimeCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.premium,
  },
  lifetimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  lifetimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 5,
  },
  lifetimeBadgeText: {
    fontSize: 10,
    color: '#34D399',
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  archivesCountText: {
    fontSize: 12,
    color: COLORS.subtle,
    ...FONTS.medium,
  },
  lifetimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lifetimeCol: {
    flex: 1,
  },
  lifetimeDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#334155',
    marginHorizontal: 14,
  },
  lifetimeLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    ...FONTS.bold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  lifetimeWeight: {
    fontSize: 22,
    color: COLORS.white,
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  lifetimeEarnings: {
    fontSize: 22,
    color: '#34D399',
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 15,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  listOrderHint: {
    fontSize: 11,
    color: COLORS.muted,
  },
});
