import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'luxury' | 'danger' | 'success' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const getContainerStyle = () => {
    const list = [styles.base];

    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    if (variant === 'primary') list.push(styles.primary);
    else if (variant === 'luxury') list.push(styles.luxury);
    else if (variant === 'secondary') list.push(styles.secondary);
    else if (variant === 'danger') list.push(styles.danger);
    else if (variant === 'success') list.push(styles.success);
    else if (variant === 'outline') list.push(styles.outline);

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled || loading) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextStyle = () => {
    const list = [styles.baseText];

    if (size === 'sm') list.push(styles.textSm);
    else if (size === 'lg') list.push(styles.textLg);
    else list.push(styles.textMd);

    if (variant === 'secondary' || variant === 'outline') {
      list.push(styles.textDark);
    } else {
      list.push(styles.textLight);
    }

    if (disabled) list.push(styles.textDisabled);
    if (textStyle) list.push(textStyle);

    return list;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 38,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  sizeLg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    minHeight: 54,
  },
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.subtle,
  },
  luxury: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.card,
  },
  secondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  danger: {
    backgroundColor: COLORS.danger,
    ...SHADOWS.subtle,
  },
  success: {
    backgroundColor: COLORS.success,
    ...SHADOWS.subtle,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  baseText: {
    textAlign: 'center',
    ...FONTS.semibold,
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 16,
    ...FONTS.bold,
  },
  textLight: {
    color: COLORS.white,
  },
  textDark: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.subtle,
  },
});
