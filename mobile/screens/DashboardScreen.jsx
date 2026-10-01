import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDiamond } from '../context/DiamondContext';
import {
  calculateTotalWeight,
  getMonthlyRecords,
  getTodayRecords,
  getMonthlyProductionTrend,
  calculateTotalAmount,
  cleanFloat,
} from '../utils/calculations';
import {
  formatCarat,
  formatCurrency,
  formatNumber,
  formatMonthYear,
  formatDate,
} from '../utils/formatters';
import StatCard from '../components/dashboard/StatCard';
import TodayProductionCard from '../components/dashboard/TodayProductionCard';
import MonthlyProductionChart from '../components/dashboard/MonthlyProductionChart';
import RecordCard from '../components/records/RecordCard';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function DashboardScreen({ navigation }) {
  const { records, monthlySummaries } = useDiamond();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Time-based greeting
  const hour = currentDate.getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
  else if (hour >= 17) greeting = 'Good Evening';

  // Metrics
  const totalDiamonds = records.length;
  const totalWeight = useMemo(() => calculateTotalWeight(records), [records]);

  // Today's records
  const todayRecords = useMemo(() => getTodayRecords(records), [records]);

  // Current Month records
  const currentMonthRecords = useMemo(
    () => getMonthlyRecords(records, currentMonth, currentYear),
    [records, currentMonth, currentYear]
  );
  const currentMonthWeight = useMemo(
    () => calculateTotalWeight(currentMonthRecords),
    [currentMonthRecords]
  );

  const currentMonthDepositedRecords = useMemo(
    () => currentMonthRecords.filter((r) => Boolean(r.isDeposited)),
    [currentMonthRecords]
  );
  const currentMonthDepositedWeight = useMemo(
    () => calculateTotalWeight(currentMonthDepositedRecords),
    [currentMonthDepositedRecords]
  );
  const currentMonthPendingWeight = useMemo(
    () => cleanFloat(Math.max(0, currentMonthWeight - currentMonthDepositedWeight)),
    [currentMonthWeight, currentMonthDepositedWeight]
  );
  const currentMonthPendingCount = currentMonthRecords.length - currentMonthDepositedRecords.length;

  // Current Month Earnings (Deposited Only)
  const currentMonthSummary = useMemo(() => {
    const id = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return monthlySummaries.find((s) => s.id === id);
  }, [monthlySummaries, currentYear, currentMonth]);

  const currentMonthEarnings = useMemo(() => {
    if (currentMonthSummary) {
      return calculateTotalAmount(currentMonthDepositedWeight, currentMonthSummary.pricePerCarat);
    }
    const latestRate = monthlySummaries[0]?.pricePerCarat || 500;
    return calculateTotalAmount(currentMonthDepositedWeight, latestRate);
  }, [currentMonthSummary, currentMonthDepositedWeight, monthlySummaries]);

  // Monthly trend for the chart
  const monthlyTrendData = useMemo(() => getMonthlyProductionTrend(records, 6), [records]);

  // Recent 4 records
  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date))
      .slice(0, 4);
  }, [records]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="diamond-stone" size={20} color={COLORS.diamond} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Diamond Prod.</Text>
            <Text style={styles.brandSubtitle}>Artisan Ledger</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
          style={styles.historyBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="time" size={15} color={COLORS.diamond} />
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.greetingSub}>OVERVIEW</Text>
          <Text style={styles.greetingTitle}>{greeting}</Text>
          <Text style={styles.greetingDesc}>
            Real-time digital diary and monthly wage tracker
          </Text>
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <StatCard
            title="TOTAL DIAMONDS"
            value={formatNumber(totalDiamonds)}
            subvalue={`${todayRecords.length} crafted today`}
            icon={<Ionicons name="layers-outline" size={16} color={COLORS.diamond} />}
            iconBg={COLORS.diamondBg}
            onPress={() => navigation.navigate('Records')}
          />

          <StatCard
            title="TOTAL WEIGHT"
            value={formatCarat(totalWeight)}
            subvalue="All-time carats"
            icon={<MaterialCommunityIcons name="scale-balance" size={16} color="#4F46E5" />}
            iconBg="#EEF2FF"
            onPress={() => navigation.navigate('Records')}
          />

          <StatCard
            title="THIS MONTH"
            value={formatCarat(currentMonthWeight)}
            subvalue={`${currentMonthRecords.length} pcs in ${formatMonthYear(currentYear, currentMonth)}`}
            icon={<Ionicons name="calendar-outline" size={16} color="#059669" />}
            iconBg="#ECFDF5"
            onPress={() => navigation.navigate('Monthly', { month: currentMonth, year: currentYear })}
          />

          <StatCard
            title="EST. EARNINGS"
            value={formatCurrency(currentMonthEarnings)}
            subvalue={`From ${formatCarat(currentMonthDepositedWeight)} dep.`}
            icon={<Text style={styles.rupeeIcon}>₹</Text>}
            iconBg="#FFFBEB"
            onPress={() => navigation.navigate('Monthly')}
          />
        </View>

        {/* Pending Deposit Alert Banner */}
        {currentMonthPendingWeight > 0 ? (
          <TouchableOpacity
            style={styles.pendingDepositsBanner}
            onPress={() => navigation.navigate('Records')}
            activeOpacity={0.85}
          >
            <View style={styles.pendingBannerLeft}>
              <View style={styles.pendingIconWrap}>
                <Ionicons name="time" size={18} color="#D97706" />
              </View>
              <View style={styles.pendingBannerTextCol}>
                <Text style={styles.pendingBannerTitle}>
                  {currentMonthPendingCount} {currentMonthPendingCount === 1 ? 'Diamond' : 'Diamonds'} Pending Deposit ({formatCarat(currentMonthPendingWeight)})
                </Text>
                <Text style={styles.pendingBannerDesc}>
                  Crafted this month but not yet counted toward earnings. Tap to review.
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D97706" />
          </TouchableOpacity>
        ) : null}

        {/* Today's Production Card */}
        <TodayProductionCard
          todayRecords={todayRecords}
          onPress={() => navigation.navigate('Records', { date: formatDate(new Date()) })}
          onAddPress={() => navigation.navigate('Add')}
        />

        {/* Monthly Production Chart */}
        <MonthlyProductionChart trendData={monthlyTrendData} />

        {/* Monthly History & Archives Shortcut */}
        <TouchableOpacity
          style={styles.historyShortcutCard}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.8}
        >
          <View style={styles.historyShortcutLeft}>
            <View style={styles.historyShortcutIconBg}>
              <MaterialCommunityIcons name="history" size={20} color={COLORS.diamond} />
            </View>
            <View style={styles.historyShortcutTextCol}>
              <Text style={styles.historyShortcutTitle}>Monthly History & Closures</Text>
              <Text style={styles.historyShortcutSub}>
                {monthlySummaries.length} saved {monthlySummaries.length === 1 ? 'month' : 'months'} • View lifetime totals
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
        </TouchableOpacity>

        {/* Recent Records Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recently Logged</Text>
              <Text style={styles.sectionSubtitle}>Latest diamond pieces</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Records')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.diamond} />
            </TouchableOpacity>
          </View>

          {recentRecords.length === 0 ? (
            <View style={styles.emptyRecent}>
              <MaterialCommunityIcons name="diamond-outline" size={28} color={COLORS.subtle} />
              <Text style={styles.emptyRecentText}>No diamonds logged yet.</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Add')}
                style={styles.emptyAddBtn}
              >
                <Text style={styles.emptyAddText}>+ Add First Diamond</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentRecords.map((item) => (
              <RecordCard
                key={item.id}
                record={item}
                onPress={() => navigation.navigate('EditDiamond', { record: item })}
              />
            ))
          )}
        </View>
      </ScrollView>
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
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.diamondBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.diamondBorder,
  },
  brandTitle: {
    fontSize: 16,
    color: COLORS.primary,
    ...FONTS.black,
  },
  brandSubtitle: {
    fontSize: 10,
    color: COLORS.muted,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  historyShortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  historyShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  historyShortcutIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.diamondBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyShortcutTextCol: {
    flex: 1,
  },
  historyShortcutTitle: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  historyShortcutSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
    ...FONTS.medium,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  welcomeBanner: {
    marginBottom: 16,
  },
  greetingSub: {
    fontSize: 10,
    color: COLORS.diamond,
    ...FONTS.bold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  greetingTitle: {
    fontSize: 24,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: -0.5,
  },
  greetingDesc: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rupeeIcon: {
    fontSize: 16,
    color: '#D97706',
    ...FONTS.bold,
  },
  recentSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    color: COLORS.diamond,
    ...FONTS.bold,
  },
  emptyRecent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyRecentText: {
    fontSize: 13,
    color: COLORS.muted,
    marginVertical: 8,
    ...FONTS.medium,
  },
  emptyAddBtn: {
    marginTop: 4,
    backgroundColor: COLORS.diamondBg,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.diamondBorder,
  },
  emptyAddText: {
    color: COLORS.diamond,
    fontSize: 12,
    ...FONTS.bold,
  },
  pendingDepositsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    ...SHADOWS.subtle,
  },
  pendingBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pendingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingBannerTextCol: {
    flex: 1,
  },
  pendingBannerTitle: {
    fontSize: 12,
    color: '#92400E',
    ...FONTS.bold,
  },
  pendingBannerDesc: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
    ...FONTS.medium,
  },
});
