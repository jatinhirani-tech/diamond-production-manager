import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { DIAMOND_SHAPES } from '../../constants/diamondShapes';
import { COLORS, FONTS } from '../../constants/theme';

export default function FilterModal({
  visible,
  onClose,
  depositFilter,
  setDepositFilter,
  shapeFilter,
  setShapeFilter,
  uniqueIdFilter,
  setUniqueIdFilter,
  sortOption,
  setSortOption,
  onReset,
}) {
  const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'weight_desc', label: 'Weight: High → Low' },
    { id: 'weight_asc', label: 'Weight: Low → High' },
  ];

  const DEPOSIT_OPTIONS = [
    { id: 'All', label: 'All Records' },
    { id: 'Deposited', label: 'Deposited Only' },
    { id: 'NotDeposited', label: 'Not Deposited' },
  ];

  const PACKET_OPTIONS = [
    { id: 'All', label: 'All Records' },
    { id: 'HasUniqueId', label: 'With Packet ID' },
    { id: 'NoUniqueId', label: 'Without Packet ID' },
  ];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Filter & Sort Records"
      subtitle="Refine your diamond ledger list"
      position="bottom"
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        {/* Sort Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort Order</Text>
          <View style={styles.chipsWrap}>
            {SORT_OPTIONS.map((opt) => {
              const active = sortOption === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSortOption(opt.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Deposit Status Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deposit Status</Text>
          <View style={styles.chipsWrap}>
            {DEPOSIT_OPTIONS.map((opt) => {
              const active = depositFilter === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setDepositFilter(opt.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Packet ID Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packet ID Status</Text>
          <View style={styles.chipsWrap}>
            {PACKET_OPTIONS.map((opt) => {
              const active = uniqueIdFilter === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setUniqueIdFilter(opt.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Diamond Shape Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diamond Shape</Text>
          <View style={styles.chipsWrap}>
            <TouchableOpacity
              onPress={() => setShapeFilter('All')}
              style={[styles.chip, shapeFilter === 'All' && styles.chipActive]}
            >
              <Text style={[styles.chipText, shapeFilter === 'All' && styles.chipTextActive]}>
                All Shapes
              </Text>
            </TouchableOpacity>
            {DIAMOND_SHAPES.map((shape) => {
              const active = shapeFilter === shape;
              return (
                <TouchableOpacity
                  key={shape}
                  onPress={() => setShapeFilter(shape)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {shape}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button
            title="Reset Filters"
            onPress={onReset}
            variant="secondary"
            size="md"
            style={styles.resetBtn}
          />
          <Button
            title="Apply Filters"
            onPress={onClose}
            variant="primary"
            size="md"
            style={styles.applyBtn}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 460,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.primary,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.divider,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.secondary,
    ...FONTS.medium,
  },
  chipTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    paddingBottom: 20,
  },
  resetBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 1,
  },
});
