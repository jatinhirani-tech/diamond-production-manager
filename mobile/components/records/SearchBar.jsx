import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search by packet ID, weight, shape, date...',
  onFilterPress,
  hasActiveFilters = false,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color={COLORS.muted} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.subtle}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {value ? (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="filter"
            size={18}
            color={hasActiveFilters ? COLORS.white : COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.subtle,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.medium,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
