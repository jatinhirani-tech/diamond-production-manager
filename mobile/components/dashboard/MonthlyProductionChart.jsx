import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatCarat } from '../../utils/formatters';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function MonthlyProductionChart({ trendData = [] }) {
  const maxWeight = Math.max(...trendData.map(d => d.weight || 0), 10);
  const CHART_HEIGHT = 110;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="chart-bar" size={20} color={COLORS.diamond} style={styles.chartIcon} />
          <View>
            <Text style={styles.title}>Monthly Production</Text>
            <Text style={styles.subtitle}>Weight trends in carats (CT)</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Last {trendData.length} Mos</Text>
        </View>
      </View>

      <View style={styles.chartArea}>
        <View style={styles.barsContainer}>
          {trendData.map((item, index) => {
            const heightRatio = maxWeight > 0 ? (item.weight / maxWeight) : 0;
            const barHeight = Math.max(heightRatio * CHART_HEIGHT, 6);
            const isLatest = index === trendData.length - 1;

            return (
              <View key={item.key || index} style={styles.barCol}>
                {/* Weight value above bar */}
                <Text style={[styles.barVal, isLatest && styles.barValActive]} numberOfLines={1}>
                  {item.weight > 0 ? formatCarat(item.weight, false) : '0'}
                </Text>

                {/* The vertical bar */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight },
                      isLatest ? styles.barFillLatest : styles.barFillStandard,
                    ]}
                  />
                </View>

                {/* Month label */}
                <Text style={[styles.barLabel, isLatest && styles.barLabelActive]} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>Unit: Carats (CT)</Text>
        <Text style={styles.footerRight}>Calculated from daily pieces</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
    ...FONTS.medium,
  },
  badge: {
    backgroundColor: COLORS.divider,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.secondary,
    ...FONTS.semibold,
  },
  chartArea: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 145,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 2,
  },
  barVal: {
    fontSize: 10,
    color: COLORS.muted,
    ...FONTS.bold,
    marginBottom: 4,
  },
  barValActive: {
    color: COLORS.diamond,
  },
  barTrack: {
    width: '75%',
    maxWidth: 28,
    height: 110,
    backgroundColor: COLORS.divider,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barFillStandard: {
    backgroundColor: COLORS.primary,
  },
  barFillLatest: {
    backgroundColor: COLORS.diamond,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.semibold,
    marginTop: 6,
  },
  barLabelActive: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 6,
  },
  footerNote: {
    fontSize: 11,
    color: COLORS.subtle,
    ...FONTS.medium,
  },
  footerRight: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.medium,
  },
});
