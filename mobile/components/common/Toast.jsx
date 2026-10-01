import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDiamond } from '../../context/DiamondContext';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function Toast() {
  const { toasts, removeToast } = useDiamond();

  if (!toasts || toasts.length === 0) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const iconName = isSuccess
          ? 'checkmark-circle'
          : isError
          ? 'alert-circle'
          : 'information-circle';
        const iconColor = isSuccess
          ? COLORS.success
          : isError
          ? COLORS.danger
          : COLORS.diamond;

        return (
          <View key={toast.id} style={styles.toast}>
            <Ionicons name={iconName} size={20} color={iconColor} style={styles.toastIcon} />
            <Text style={styles.toastText}>{toast.message}</Text>
            <TouchableOpacity
              onPress={() => removeToast(toast.id)}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.premium,
  },
  toastIcon: {
    marginRight: 10,
  },
  toastText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    ...FONTS.semibold,
  },
  closeBtn: {
    marginLeft: 8,
    padding: 2,
  },
});
