import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function Card({ children, style, onPress, variant = 'default' }) {
  const cardStyles = [
    styles.card,
    variant === 'dark' ? styles.darkCard : null,
    variant === 'accent' ? styles.accentCard : null,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={cardStyles}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
    marginBottom: 12,
  },
  darkCard: {
    backgroundColor: COLORS.primary,
    borderColor: '#1E293B',
  },
  accentCard: {
    backgroundColor: COLORS.diamondBg,
    borderColor: COLORS.diamondBorder,
  },
});
