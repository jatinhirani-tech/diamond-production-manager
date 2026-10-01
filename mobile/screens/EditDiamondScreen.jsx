import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDiamond } from '../context/DiamondContext';
import { DIAMOND_SHAPES } from '../constants/diamondShapes';
import { formatDate } from '../utils/formatters';
import { validateDiamondRecord } from '../utils/validation';
import Button from '../components/common/Button';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function EditDiamondScreen({ navigation, route }) {
  const { record } = route.params || {};
  const { updateRecord } = useDiamond();

  if (!record) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Record not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="primary" />
        </View>
      </SafeAreaView>
    );
  }

  // Pre-filled Form State
  const [date, setDate] = useState(record.date);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState(new Date(record.date));

  const [weight, setWeight] = useState(String(record.weight || ''));
  const [shape, setShape] = useState(record.shape || 'Round');
  const hasId = record.hasPacketId !== undefined ? Boolean(record.hasPacketId) : Boolean(record.hasUniqueId);
  const [hasUniqueId, setHasUniqueId] = useState(hasId);
  const [packetId, setPacketId] = useState(record.packetId || '');
  const [notes, setNotes] = useState(record.notes || '');
  const [isDeposited, setIsDeposited] = useState(Boolean(record.isDeposited));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDateObj(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  };

  const handleUpdate = async () => {
    const payload = {
      date,
      weight,
      shape,
      hasPacketId: hasUniqueId,
      hasUniqueId,
      packetId: hasUniqueId ? packetId : null,
      notes,
      isDeposited,
    };

    const { isValid, errors: validationErrors } = validateDiamondRecord(payload);
    if (!isValid) {
      setErrors(validationErrors);
      setTouched({ weight: true, shape: true, packetId: true });
      return;
    }

    await updateRecord(record.id, payload);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Edit Diamond</Text>
          <Text style={styles.subtitle}>Crafted on {formatDate(record.date)}</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formCard}>
            {/* 1. Date Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Production Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerBtn}
              >
                <Ionicons name="calendar-outline" size={18} color={COLORS.diamond} style={styles.inputIcon} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <Text style={styles.changeDateText}>Change</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
              />
            )}

            {/* 2. Diamond Weight */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>
                  Diamond Weight <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.unitHint}>In Carats (CT)</Text>
              </View>

              <View style={[styles.inputWrapper, touched.weight && errors.weight && styles.inputError]}>
                <TextInput
                  value={weight}
                  onChangeText={(val) => {
                    setWeight(val);
                    if (errors.weight) setErrors((prev) => ({ ...prev, weight: null }));
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, weight: true }))}
                  placeholder="e.g. 4.50"
                  placeholderTextColor={COLORS.subtle}
                  keyboardType="numeric"
                  style={styles.weightInput}
                />
                <View style={styles.ctBadge}>
                  <Text style={styles.ctText}>CT</Text>
                </View>
              </View>

              {touched.weight && errors.weight ? (
                <Text style={styles.errorText}>{errors.weight}</Text>
              ) : null}
            </View>

            {/* 3. Diamond Shape Selector */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Diamond Shape <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.shapesScroll}
              >
                {DIAMOND_SHAPES.map((s) => {
                  const active = shape === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setShape(s)}
                      style={[styles.shapeChip, active && styles.shapeChipActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.shapeText, active && styles.shapeTextActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 4. Packet ID Section */}
            <View style={styles.packetSection}>
              <Text style={styles.packetPrompt}>
                Does this packet have a unique ID?
              </Text>

              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setHasUniqueId(true)}
                  style={[styles.toggleBtn, hasUniqueId && styles.toggleBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleText, hasUniqueId && styles.toggleTextActive]}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setHasUniqueId(false);
                    setPacketId('');
                  }}
                  style={[styles.toggleBtn, !hasUniqueId && styles.toggleBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.toggleText, !hasUniqueId && styles.toggleTextActive]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>

              {hasUniqueId ? (
                <View style={styles.packetInputGroup}>
                  <Text style={styles.packetInputLabel}>
                    Packet ID <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={packetId}
                    onChangeText={(val) => {
                      setPacketId(val);
                      if (errors.packetId) setErrors((prev) => ({ ...prev, packetId: null }));
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, packetId: true }))}
                    placeholder="e.g. PKT-00125"
                    placeholderTextColor={COLORS.subtle}
                    autoCapitalize="characters"
                    style={[
                      styles.textInput,
                      touched.packetId && errors.packetId && styles.inputError,
                    ]}
                  />
                  {touched.packetId && errors.packetId ? (
                    <Text style={styles.errorText}>{errors.packetId}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            {/* Deposit Status Section */}
            <View style={styles.packetSection}>
              <View style={styles.depositLabelRow}>
                <Text style={styles.packetPrompt}>
                  Deposit Status <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.depositHint}>Counts toward monthly earnings</Text>
              </View>

              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setIsDeposited(true)}
                  style={[styles.toggleBtn, isDeposited && styles.toggleBtnDeposited]}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleInner}>
                    {isDeposited ? (
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                    ) : null}
                    <Text style={[styles.toggleText, isDeposited && styles.toggleTextActive]}>
                      Deposited
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsDeposited(false)}
                  style={[styles.toggleBtn, !isDeposited && styles.toggleBtnNotDeposited]}
                  activeOpacity={0.8}
                >
                  <View style={styles.toggleInner}>
                    {!isDeposited ? (
                      <Ionicons name="time" size={16} color={COLORS.white} />
                    ) : null}
                    <Text style={[styles.toggleText, !isDeposited && styles.toggleTextActive]}>
                      Not Deposited
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* 5. Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Good quality, Customer XYZ..."
                placeholderTextColor={COLORS.subtle}
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.multilineInput]}
              />
            </View>

            {/* 6. Buttons */}
            <View style={styles.buttonsContainer}>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="secondary"
                size="lg"
              />
              <Button
                title="Update Record"
                onPress={handleUpdate}
                variant="primary"
                size="lg"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.primary,
    ...FONTS.bold,
    marginBottom: 6,
  },
  unitHint: {
    fontSize: 11,
    color: COLORS.diamond,
    ...FONTS.semibold,
  },
  required: {
    color: COLORS.danger,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  changeDateText: {
    fontSize: 12,
    color: COLORS.diamond,
    ...FONTS.bold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  weightInput: {
    flex: 1,
    fontSize: 20,
    color: COLORS.primary,
    ...FONTS.black,
    paddingVertical: 0,
  },
  ctBadge: {
    backgroundColor: COLORS.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ctText: {
    fontSize: 12,
    color: COLORS.primary,
    ...FONTS.black,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    ...FONTS.medium,
  },
  shapesScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  shapeChip: {
    backgroundColor: COLORS.divider,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  shapeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  shapeText: {
    fontSize: 13,
    color: COLORS.secondary,
    ...FONTS.semibold,
  },
  shapeTextActive: {
    color: COLORS.white,
    ...FONTS.bold,
  },
  packetSection: {
    backgroundColor: COLORS.divider,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  packetPrompt: {
    fontSize: 13,
    color: COLORS.primary,
    ...FONTS.bold,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleBtnDeposited: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  toggleBtnNotDeposited: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  depositLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  depositHint: {
    fontSize: 11,
    color: COLORS.muted,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.secondary,
    ...FONTS.bold,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  packetInputGroup: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  packetInputLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    ...FONTS.bold,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.medium,
  },
  multilineInput: {
    height: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    gap: 10,
    marginTop: 8,
  },
});
