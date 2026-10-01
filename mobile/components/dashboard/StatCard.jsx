import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function StatCard({
  title,
  value,
  subvalue,
  icon,
  iconBg = COLORS.diamondBg,
  onPress,
}) {
  const content = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {icon && (
          <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
            {icon}
          </View>
        )}
      </View>

      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>

      {subvalue ? (
        <Text style={styles.subvalue} numberOfLines={1}>
          {subvalue}
        </Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.wrapper}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.wrapper}>{content}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: '47%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    color: COLORS.primary,
    ...FONTS.black,
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  subvalue: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
    ...FONTS.medium,
  },
});
