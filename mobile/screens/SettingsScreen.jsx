import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useDiamond } from '../context/DiamondContext';
import { storageService } from '../services/storageService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { COLORS, SHADOWS, FONTS } from '../constants/theme';

export default function SettingsScreen({ navigation }) {
  const {
    records,
    monthlySummaries,
    exportAllData,
    importAllData,
    clearAllData,
    resetToSampleData,
    showToast,
  } = useDiamond();

  const [storageUsage, setStorageUsage] = useState({ bytes: 0, kb: '0.00' });
  const [showClearModal, setShowClearModal] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('replace');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadStorageInfo() {
      const usage = await storageService.getStorageUsage();
      setStorageUsage(usage);
    }
    loadStorageInfo();
  }, [records, monthlySummaries]);

  // Export JSON using expo-file-system & expo-sharing
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await exportAllData();
      const jsonString = JSON.stringify(data, null, 2);
      const nowStr = new Date().toISOString().split('T')[0];
      const filename = `diamond_production_backup_${nowStr}.json`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Diamond Production Backup',
          UTI: 'public.json',
        });
        showToast('Data exported successfully', 'success');
      } else {
        showToast(`Saved to device: ${filename}`, 'success');
      }
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Import JSON using expo-document-picker
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/json', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const fileAsset = result.assets[0];
      const fileContent = await FileSystem.readAsStringAsync(fileAsset.uri);
      const parsed = JSON.parse(fileContent);

      const recs = Array.isArray(parsed.records) ? parsed.records : [];
      const sums = Array.isArray(parsed.monthlySummaries) ? parsed.monthlySummaries : [];

      if (recs.length === 0 && sums.length === 0) {
        showToast('No valid records found in JSON file', 'error');
        return;
      }

      setImportPreview({
        data: parsed,
        recordsCount: recs.length,
        summariesCount: sums.length,
        fileName: fileAsset.name || 'backup.json',
      });
    } catch (err) {
      console.error('Import file pick error:', err);
      showToast('Invalid or unreadable backup file', 'error');
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    await importAllData(importPreview.data, importMode);
    setImportPreview(null);
  };

  const handleClearAll = async () => {
    await clearAllData();
    setShowClearModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Storage, backups, and app maintenance</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Local Storage Privacy Card (Section 24) */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <View style={styles.shieldIcon}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#38BDF8" />
            </View>
            <View style={styles.privacyTitleCol}>
              <View style={styles.onlineStatusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.privacyStatus}>100% OFFLINE & PRIVATE</Text>
              </View>
              <Text style={styles.privacyHeading}>Local Device Storage</Text>
            </View>
          </View>

          <Text style={styles.privacyDesc}>
            Your diamond production data is stored strictly on this device using local persistent memory.
            No cloud database or external servers are used.
          </Text>

          <View style={styles.storageStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Storage Used</Text>
              <Text style={styles.statVal}>{storageUsage.kb} KB</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Records</Text>
              <Text style={styles.statVal}>{records.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Saved Months</Text>
              <Text style={styles.statVal}>{monthlySummaries.length}</Text>
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <Text style={styles.sectionHeading}>BACKUP & RESTORE</Text>

        <View style={styles.cardGroup}>
          {/* Export Row */}
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <View style={[styles.actionIconBadge, { backgroundColor: COLORS.diamondBg }]}>
                <Ionicons name="download-outline" size={20} color={COLORS.diamond} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Export Backup</Text>
                <Text style={styles.actionDesc}>Save all records & summaries as JSON</Text>
              </View>
            </View>
            <Button
              title="Export"
              onPress={handleExport}
              loading={isExporting}
              variant="primary"
              size="sm"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Import Row */}
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <View style={[styles.actionIconBadge, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="cloud-upload-outline" size={20} color="#4F46E5" />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Import Data</Text>
                <Text style={styles.actionDesc}>Restore previous JSON backup file</Text>
              </View>
            </View>
            <Button
              title="Import"
              onPress={handlePickFile}
              variant="secondary"
              size="sm"
            />
          </View>
        </View>

        {/* Archives & History Shortcut */}
        <Text style={styles.sectionHeading}>ARCHIVES & LIFETIME</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <View style={[styles.actionIconBadge, { backgroundColor: COLORS.diamondBg }]}>
                <Ionicons name="time-outline" size={20} color={COLORS.diamond} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Monthly History & Archives</Text>
                <Text style={styles.actionDesc}>
                  {monthlySummaries.length} saved monthly {monthlySummaries.length === 1 ? 'summary' : 'summaries'} • Lifetime totals
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </TouchableOpacity>
        </View>

        {/* Demo Data & Danger Zone */}
        <Text style={styles.sectionHeading}>DATA MAINTENANCE</Text>

        <View style={styles.cardGroup}>
          {/* Demo Data */}
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <View style={[styles.actionIconBadge, { backgroundColor: COLORS.divider }]}>
                <MaterialCommunityIcons name="database-refresh-outline" size={20} color={COLORS.secondary} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={styles.actionTitle}>Load Demo Records</Text>
                <Text style={styles.actionDesc}>Populate sample pieces for testing</Text>
              </View>
            </View>
            <Button
              title="Load"
              onPress={resetToSampleData}
              variant="secondary"
              size="sm"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Clear All Data */}
          <View style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <View style={[styles.actionIconBadge, { backgroundColor: COLORS.dangerLight }]}>
                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              </View>
              <View style={styles.actionTextCol}>
                <Text style={[styles.actionTitle, { color: COLORS.danger }]}>Clear All Data</Text>
                <Text style={styles.actionDesc}>Permanently wipe all records on device</Text>
              </View>
            </View>
            <Button
              title="Wipe"
              onPress={() => setShowClearModal(true)}
              variant="danger"
              size="sm"
            />
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.footerNote}>
          <Text style={styles.versionText}>Diamond Production Manager Mobile • v1.0.0</Text>
          <Text style={styles.offlineText}>Native iOS & Android Edition</Text>
        </View>
      </ScrollView>

      {/* Import Preview Modal */}
      {importPreview && (
        <Modal
          visible={Boolean(importPreview)}
          onClose={() => setImportPreview(null)}
          title="Restore Backup"
          subtitle={`File: ${importPreview.fileName}`}
          position="center"
        >
          <View style={styles.importModalContent}>
            <View style={styles.statsPreviewBox}>
              <Text style={styles.previewStatText}>
                • <Text style={styles.boldText}>{importPreview.recordsCount}</Text> Diamond Records found
              </Text>
              <Text style={styles.previewStatText}>
                • <Text style={styles.boldText}>{importPreview.summariesCount}</Text> Monthly Summaries found
              </Text>
            </View>

            <Text style={styles.modePrompt}>Choose Import Mode:</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                onPress={() => setImportMode('replace')}
                style={[styles.modeCard, importMode === 'replace' && styles.modeCardActive]}
              >
                <Text style={[styles.modeTitle, importMode === 'replace' && styles.modeTitleActive]}>
                  Replace
                </Text>
                <Text style={styles.modeDesc}>Overwrite existing data with file</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setImportMode('merge')}
                style={[styles.modeCard, importMode === 'merge' && styles.modeCardActive]}
              >
                <Text style={[styles.modeTitle, importMode === 'merge' && styles.modeTitleActive]}>
                  Merge
                </Text>
                <Text style={styles.modeDesc}>Combine file with current records</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonsRow}>
              <Button
                title="Cancel"
                onPress={() => setImportPreview(null)}
                variant="secondary"
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                title="Confirm Import"
                onPress={handleConfirmImport}
                variant="primary"
                size="md"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Clear All Data Strong Confirmation Modal */}
      <Modal
        visible={showClearModal}
        onClose={() => setShowClearModal(false)}
        position="center"
      >
        <View style={styles.dangerModalContent}>
          <View style={styles.dangerIconCircle}>
            <Ionicons name="warning" size={32} color={COLORS.danger} />
          </View>
          <Text style={styles.dangerModalTitle}>Clear All Production Data?</Text>
          <Text style={styles.dangerModalDesc}>
            This will permanently remove all diamond records and monthly summaries from this device.
            This action cannot be undone.
          </Text>

          <View style={styles.modalButtonsRow}>
            <Button
              title="Cancel"
              onPress={() => setShowClearModal(false)}
              variant="secondary"
              size="md"
              style={{ flex: 1 }}
            />
            <Button
              title="Clear Everything"
              onPress={handleClearAll}
              variant="danger"
              size="md"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
    ...FONTS.black,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    ...FONTS.medium,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  privacyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.premium,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  shieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  privacyTitleCol: {
    flex: 1,
  },
  onlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  privacyStatus: {
    fontSize: 10,
    color: '#34D399',
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  privacyHeading: {
    fontSize: 16,
    color: COLORS.white,
    ...FONTS.bold,
  },
  privacyDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 16,
  },
  storageStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.subtle,
    ...FONTS.medium,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 14,
    color: COLORS.white,
    ...FONTS.bold,
  },
  sectionHeading: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.bold,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  cardGroup: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.subtle,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  actionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextCol: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  actionDesc: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 16,
  },
  footerNote: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 4,
  },
  versionText: {
    fontSize: 11,
    color: COLORS.muted,
    ...FONTS.medium,
  },
  offlineText: {
    fontSize: 10,
    color: COLORS.subtle,
  },
  importModalContent: {
    paddingVertical: 8,
  },
  statsPreviewBox: {
    backgroundColor: COLORS.divider,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 4,
  },
  previewStatText: {
    fontSize: 13,
    color: COLORS.secondary,
  },
  boldText: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
  modePrompt: {
    fontSize: 12,
    color: COLORS.primary,
    ...FONTS.bold,
    marginBottom: 8,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modeCardActive: {
    borderColor: COLORS.diamond,
    backgroundColor: COLORS.diamondBg,
  },
  modeTitle: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.bold,
    marginBottom: 2,
  },
  modeTitleActive: {
    color: COLORS.diamond,
  },
  modeDesc: {
    fontSize: 10,
    color: COLORS.muted,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dangerModalContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  dangerModalTitle: {
    fontSize: 18,
    color: COLORS.primary,
    ...FONTS.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  dangerModalDesc: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
});
