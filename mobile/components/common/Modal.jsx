import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function Modal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  position = 'center', // 'center' | 'bottom'
}) {
  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType={position === 'bottom' ? 'slide' : 'fade'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, position === 'bottom' ? styles.overlayBottom : styles.overlayCenter]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation?.()}>
            <View
              style={[
                styles.container,
                position === 'bottom' ? styles.bottomSheet : styles.dialog,
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                  {title ? <Text style={styles.title}>{title}</Text> : null}
                  {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color={COLORS.muted} />
                </TouchableOpacity>
              </View>

              {/* Body */}
              <View style={styles.body}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayBottom: {
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.card,
    width: '100%',
    overflow: 'hidden',
    ...SHADOWS.premium,
  },
  dialog: {
    borderRadius: 24,
    maxWidth: 420,
    maxHeight: '85%',
  },
  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
