import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCarat, formatDate } from '../../utils/formatters';
import { COLORS, FONTS } from '../../constants/theme';

export default function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  record,
  isMonthlySummary = false,
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      position="center"
    >
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="trash-outline" size={28} color={COLORS.danger} />
        </View>

        <Text style={styles.title}>
          {isMonthlySummary ? 'Delete Monthly Summary?' : 'Delete Diamond?'}
        </Text>

        <Text style={styles.message}>
          {isMonthlySummary
            ? 'Are you sure you want to delete this saved monthly summary? Diamond records for this month will remain intact.'
            : 'Are you sure you want to delete this production record? This will immediately recalculate daily and monthly totals.'}
        </Text>

        {record && !isMonthlySummary ? (
          <View style={styles.previewBox}>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Date:</Text>
              <Text style={styles.previewVal}>{formatDate(record.date)}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Weight:</Text>
              <Text style={[styles.previewVal, styles.weightVal]}>{formatCarat(record.weight)}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Shape:</Text>
              <Text style={styles.previewVal}>{record.shape}</Text>
            </View>
            {record.packetId ? (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Packet ID:</Text>
                <Text style={styles.previewVal}>{record.packetId}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.buttonsRow}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            size="md"
            style={styles.cancelBtn}
          />
          <Button
            title="Delete"
            onPress={() => {
              onConfirm();
              onClose();
            }}
            variant="danger"
            size="md"
            style={styles.deleteBtn}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: COLORS.primary,
    ...FONTS.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  previewBox: {
    width: '100%',
    backgroundColor: COLORS.divider,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  previewLabel: {
    fontSize: 12,
    color: COLORS.muted,
    ...FONTS.medium,
  },
  previewVal: {
    fontSize: 12,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  weightVal: {
    color: COLORS.diamond,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
  },
  deleteBtn: {
    flex: 1,
  },
});
