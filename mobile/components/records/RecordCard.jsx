import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCarat, formatDate } from '../../utils/formatters';
import { SHAPE_COLORS } from '../../constants/diamondShapes';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function RecordCard({ record, onEdit, onDelete, onPress }) {
  const shapeStyle = SHAPE_COLORS[record.shape] || SHAPE_COLORS.Other;
  const hasId = record.hasPacketId !== undefined ? record.hasPacketId : record.hasUniqueId;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => (onPress ? onPress(record) : onEdit ? onEdit(record) : null)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <Text style={styles.weightText}>{formatCarat(record.weight)}</Text>
          <View style={styles.badgesRow}>
            {/* Shape Badge */}
            <View style={[styles.badge, { backgroundColor: shapeStyle.bg, borderColor: shapeStyle.border }]}>
              <Text style={[styles.badgeText, { color: shapeStyle.text }]}>{record.shape}</Text>
            </View>

            {/* Packet ID Badge */}
            {hasId && record.packetId ? (
              <View style={styles.packetBadge}>
                <Ionicons name="pricetag-outline" size={11} color={COLORS.muted} style={styles.packetIcon} />
                <Text style={styles.packetText}>{record.packetId}</Text>
              </View>
            ) : (
              <View style={styles.noIdBadge}>
                <Text style={styles.noIdText}>No Unique ID</Text>
              </View>
            )}

            {/* Deposit Status Badge */}
            {record.isDeposited ? (
              <View style={styles.depositedBadge}>
                <Ionicons name="checkmark-circle" size={11} color="#059669" style={styles.badgeIcon} />
                <Text style={styles.depositedText}>Deposited</Text>
              </View>
            ) : (
              <View style={styles.notDepositedBadge}>
                <Ionicons name="time" size={11} color={COLORS.muted} style={styles.badgeIcon} />
                <Text style={styles.notDepositedText}>Not Deposited</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(record)}
              style={styles.actionBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={16} color={COLORS.diamond} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(record)}
              style={[styles.actionBtn, styles.deleteBtn]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notes if available */}
      {record.notes ? (
        <View style={styles.notesRow}>
          <Ionicons name="document-text-outline" size={12} color={COLORS.muted} style={styles.notesIcon} />
          <Text style={styles.notesText} numberOfLines={2}>{record.notes}</Text>
        </View>
      ) : null}

      {/* Footer Timestamp */}
      {record.createdAt ? (
        <View style={styles.footerRow}>
          <Text style={styles.dateLabel}>{formatDate(record.date)}</Text>
          <Text style={styles.timestampText}>
            Logged {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
  },
  weightText: {
    fontSize: 20,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: -0.3,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    ...FONTS.bold,
  },
  packetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.divider,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  packetIcon: {
    marginRight: 4,
  },
  packetText: {
    fontSize: 11,
    color: COLORS.secondary,
    ...FONTS.semibold,
  },
  noIdBadge: {
    backgroundColor: COLORS.divider,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
  },
  noIdText: {
    fontSize: 10,
    color: COLORS.subtle,
    ...FONTS.medium,
  },
  badgeIcon: {
    marginRight: 4,
  },
  depositedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  depositedText: {
    fontSize: 11,
    color: '#047857',
    ...FONTS.bold,
  },
  notDepositedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.divider,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  notDepositedText: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.semibold,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.diamondBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  notesIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 16,
    ...FONTS.regular,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
  },
  dateLabel: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.medium,
  },
  timestampText: {
    fontSize: 10,
    color: COLORS.subtle,
  },
});
