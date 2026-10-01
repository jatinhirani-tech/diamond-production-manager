import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../utils/idGenerator.js';

const RECORDS_KEY = 'diamond_records';
const MONTHLY_SUMMARIES_KEY = 'diamond_monthly_summaries';

export const storageService = {
  /**
   * Retrieves all diamond records from AsyncStorage
   * @returns {Promise<Array>}
   */
  async getRecords() {
    try {
      const data = await AsyncStorage.getItem(RECORDS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Ensure safe fallback for records created before this feature existed
      return parsed.map(r => ({
        ...r,
        isDeposited: Boolean(r.isDeposited),
      }));
    } catch (err) {
      console.error('AsyncStorage: Failed to get records', err);
      return [];
    }
  },

  /**
   * Overwrites all diamond records in AsyncStorage
   * @param {Array} records
   * @returns {Promise<boolean>}
   */
  async saveRecords(records) {
    try {
      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(records));
      return true;
    } catch (err) {
      console.error('AsyncStorage: Failed to save records', err);
      return false;
    }
  },

  /**
   * Adds a new single diamond record
   * @param {Object} record
   * @returns {Promise<Object>}
   */
  async addRecord(record) {
    const records = await this.getRecords();
    const now = new Date().toISOString();

    const hasId = record.hasPacketId !== undefined ? Boolean(record.hasPacketId) : Boolean(record.hasUniqueId);

    const newRecord = {
      id: record.id || generateId('pkt_'),
      date: record.date,
      weight: Number(record.weight),
      shape: record.shape,
      hasPacketId: hasId,
      hasUniqueId: hasId,
      packetId: hasId ? (record.packetId || '').trim() : null,
      notes: (record.notes || '').trim(),
      isDeposited: Boolean(record.isDeposited),
      createdAt: record.createdAt || now,
      updatedAt: now,
    };

    records.push(newRecord);
    await this.saveRecords(records);
    return newRecord;
  },

  /**
   * Updates an existing diamond record by ID
   * @param {string} id
   * @param {Object} updatedFields
   * @returns {Promise<Object|null>}
   */
  async updateRecord(id, updatedFields) {
    const records = await this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const existing = records[index];
    const hasId = updatedFields.hasPacketId !== undefined
      ? Boolean(updatedFields.hasPacketId)
      : (updatedFields.hasUniqueId !== undefined ? Boolean(updatedFields.hasUniqueId) : existing.hasPacketId);

    const updated = {
      ...existing,
      ...updatedFields,
      weight: Number(updatedFields.weight !== undefined ? updatedFields.weight : existing.weight),
      hasPacketId: hasId,
      hasUniqueId: hasId,
      packetId: hasId
        ? (updatedFields.packetId !== undefined ? (updatedFields.packetId || '').trim() : existing.packetId)
        : null,
      notes: updatedFields.notes !== undefined ? (updatedFields.notes || '').trim() : existing.notes,
      isDeposited: updatedFields.isDeposited !== undefined ? Boolean(updatedFields.isDeposited) : Boolean(existing.isDeposited),
      updatedAt: new Date().toISOString(),
    };

    records[index] = updated;
    await this.saveRecords(records);
    return updated;
  },

  /**
   * Deletes a record by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteRecord(id) {
    const records = await this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    await this.saveRecords(filtered);
    return true;
  },

  /**
   * Retrieves all monthly summaries from AsyncStorage
   * @returns {Promise<Array>}
   */
  async getMonthlySummaries() {
    try {
      const data = await AsyncStorage.getItem(MONTHLY_SUMMARIES_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.sort((a, b) => {
        const idA = `${a.year}-${String(a.month).padStart(2, '0')}`;
        const idB = `${b.year}-${String(b.month).padStart(2, '0')}`;
        return idB.localeCompare(idA);
      });
    } catch (err) {
      console.error('AsyncStorage: Failed to get monthly summaries', err);
      return [];
    }
  },

  /**
   * Saves or replaces a monthly summary
   * @param {Object} summary
   * @returns {Promise<Object|null>}
   */
  async saveMonthlySummary(summary) {
    const summaries = await this.getMonthlySummaries();
    const id = summary.id || `${summary.year}-${String(summary.month).padStart(2, '0')}`;
    const now = new Date().toISOString();

    const summaryData = {
      id,
      month: Number(summary.month),
      year: Number(summary.year),
      totalDiamonds: Number(summary.totalDiamonds),
      totalWeight: Number(summary.totalWeight),
      depositedDiamonds: Number(summary.depositedDiamonds !== undefined ? summary.depositedDiamonds : summary.totalDiamonds),
      depositedWeight: Number(summary.depositedWeight !== undefined ? summary.depositedWeight : summary.totalWeight),
      pricePerCarat: Number(summary.pricePerCarat),
      totalAmount: Number(summary.totalAmount),
      notes: summary.notes || '',
      savedAt: summary.savedAt || now,
      updatedAt: now,
    };

    const existingIndex = summaries.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      summaries[existingIndex] = {
        ...summaries[existingIndex],
        ...summaryData,
      };
    } else {
      summaries.unshift(summaryData);
    }

    try {
      await AsyncStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(summaries));
      return summaryData;
    } catch (err) {
      console.error('AsyncStorage: Failed to save monthly summary', err);
      return null;
    }
  },

  /**
   * Updates an existing monthly summary
   * @param {string} id
   * @param {Object} updatedFields
   * @returns {Promise<Object|null>}
   */
  async updateMonthlySummary(id, updatedFields) {
    const summaries = await this.getMonthlySummaries();
    const index = summaries.findIndex(s => s.id === id);
    if (index === -1) return null;

    const existing = summaries[index];
    const updated = {
      ...existing,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    summaries[index] = updated;
    try {
      await AsyncStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(summaries));
      return updated;
    } catch (err) {
      console.error('AsyncStorage: Failed to update monthly summary', err);
      return null;
    }
  },

  /**
   * Deletes a monthly summary by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteMonthlySummary(id) {
    const summaries = await this.getMonthlySummaries();
    const filtered = summaries.filter(s => s.id !== id);
    if (filtered.length === summaries.length) return false;
    try {
      await AsyncStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('AsyncStorage: Failed to delete monthly summary', err);
      return false;
    }
  },

  /**
   * Exports all local diamond data and monthly summaries
   * @returns {Promise<Object>}
   */
  async exportData() {
    const records = await this.getRecords();
    const monthlySummaries = await this.getMonthlySummaries();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      records,
      monthlySummaries,
    };
  },

  /**
   * Imports data into AsyncStorage
   * @param {Object} data
   * @param {string} mode 'replace' | 'merge'
   * @returns {Promise<{ success: boolean, recordsCount: number, summariesCount: number, error?: string }>}
   */
  /**
   * Overwrites all monthly summaries in AsyncStorage
   * @param {Array} summaries
   * @returns {Promise<boolean>}
   */
  async saveMonthlySummaries(summaries) {
    try {
      await AsyncStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(summaries));
      return true;
    } catch (err) {
      console.error('AsyncStorage: Failed to save monthly summaries', err);
      return false;
    }
  },

  /**
   * Imports data into AsyncStorage
   * @param {Object} data
   * @param {string} mode 'replace' | 'merge'
   * @returns {Promise<{ success: boolean, recordsCount: number, summariesCount: number, error?: string }>}
   */
  async importData(data, mode = 'replace') {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid JSON data format' };
      }

      const importedRecords = Array.isArray(data.records) ? data.records : [];
      const importedSummaries = Array.isArray(data.monthlySummaries) ? data.monthlySummaries : [];

      if (importedRecords.length === 0 && importedSummaries.length === 0) {
        return { success: false, error: 'No diamond records or summaries found in file' };
      }

      if (mode === 'replace') {
        await this.saveRecords(importedRecords);
        await this.saveMonthlySummaries(importedSummaries);
      } else {
        const currentRecords = await this.getRecords();
        const recordMap = new Map(currentRecords.map(r => [r.id, r]));
        importedRecords.forEach(r => recordMap.set(r.id, r));
        await this.saveRecords(Array.from(recordMap.values()));

        const currentSummaries = await this.getMonthlySummaries();
        const summaryMap = new Map(currentSummaries.map(s => [s.id, s]));
        importedSummaries.forEach(s => summaryMap.set(s.id, s));
        await this.saveMonthlySummaries(Array.from(summaryMap.values()));
      }

      return {
        success: true,
        recordsCount: importedRecords.length,
        summariesCount: importedSummaries.length,
      };
    } catch (err) {
      console.error('AsyncStorage: Import failed', err);
      return { success: false, error: err.message || 'Unknown import error' };
    }
  },

  /**
   * Clears all local application data
   * @returns {Promise<boolean>}
   */
  async clearAllData() {
    try {
      await this.saveRecords([]);
      await this.saveMonthlySummaries([]);
      return true;
    } catch (err) {
      console.error('AsyncStorage: Failed to clear data', err);
      return false;
    }
  },

  /**
   * Gets approximate storage usage in KB
   * @returns {Promise<{ bytes: number, kb: string }>}
   */
  async getStorageUsage() {
    try {
      const records = (await AsyncStorage.getItem(RECORDS_KEY)) || '';
      const summaries = (await AsyncStorage.getItem(MONTHLY_SUMMARIES_KEY)) || '';
      const totalBytes = (records.length + summaries.length) * 2;
      return {
        bytes: totalBytes,
        kb: (totalBytes / 1024).toFixed(2),
      };
    } catch {
      return { bytes: 0, kb: '0.00' };
    }
  },
};
