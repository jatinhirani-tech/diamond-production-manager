import { generateId } from '../utils/idGenerator.js';

const RECORDS_KEY = 'diamond_records';
const MONTHLY_SUMMARIES_KEY = 'diamond_monthly_summaries';

/**
 * Storage Service for local-only Diamond Production Manager
 */
export const storageService = {
  /**
   * Retrieves all diamond records from localStorage
   * @returns {Array} List of records
   */
  getRecords() {
    try {
      const data = localStorage.getItem(RECORDS_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Ensure safe fallback for records created before this feature existed
      return parsed.map(r => ({
        ...r,
        isDeposited: Boolean(r.isDeposited),
      }));
    } catch (err) {
      console.error('Failed to read diamond records from localStorage:', err);
      return [];
    }
  },

  /**
   * Overwrites all diamond records in localStorage
   * @param {Array} records
   */
  saveRecords(records) {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
      return true;
    } catch (err) {
      console.error('Failed to save diamond records to localStorage:', err);
      return false;
    }
  },

  /**
   * Adds a new single diamond record
   * @param {Object} record
   * @returns {Object} Stored record with generated ID and timestamps
   */
  addRecord(record) {
    const records = this.getRecords();
    const now = new Date().toISOString();
    
    const newRecord = {
      id: record.id || generateId('pkt_'),
      date: record.date,
      weight: Number(record.weight),
      shape: record.shape,
      hasUniqueId: Boolean(record.hasUniqueId),
      packetId: record.hasUniqueId ? (record.packetId || '').trim() : null,
      notes: (record.notes || '').trim(),
      isDeposited: Boolean(record.isDeposited),
      createdAt: record.createdAt || now,
      updatedAt: now,
    };

    records.push(newRecord);
    this.saveRecords(records);
    return newRecord;
  },

  /**
   * Updates an existing diamond record by ID
   * @param {string} id
   * @param {Object} updatedFields
   * @returns {Object|null} Updated record or null if not found
   */
  updateRecord(id, updatedFields) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const existing = records[index];
    const updated = {
      ...existing,
      ...updatedFields,
      weight: Number(updatedFields.weight !== undefined ? updatedFields.weight : existing.weight),
      hasUniqueId: Boolean(updatedFields.hasUniqueId !== undefined ? updatedFields.hasUniqueId : existing.hasUniqueId),
      packetId: updatedFields.hasUniqueId
        ? (updatedFields.packetId || '').trim()
        : (updatedFields.hasUniqueId === false ? null : existing.packetId),
      notes: updatedFields.notes !== undefined ? (updatedFields.notes || '').trim() : existing.notes,
      isDeposited: updatedFields.isDeposited !== undefined ? Boolean(updatedFields.isDeposited) : Boolean(existing.isDeposited),
      updatedAt: new Date().toISOString(),
    };

    records[index] = updated;
    this.saveRecords(records);
    return updated;
  },

  /**
   * Deletes a record by ID
   * @param {string} id
   * @returns {boolean} Success status
   */
  deleteRecord(id) {
    const records = this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === records.length) return false;
    this.saveRecords(filtered);
    return true;
  },

  /**
   * Retrieves all monthly summaries
   * @returns {Array} List of monthly summaries
   */
  getMonthlySummaries() {
    try {
      const data = localStorage.getItem(MONTHLY_SUMMARIES_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Sort newest month first by default
      return parsed.sort((a, b) => {
        const idA = `${a.year}-${String(a.month).padStart(2, '0')}`;
        const idB = `${b.year}-${String(b.month).padStart(2, '0')}`;
        return idB.localeCompare(idA);
      });
    } catch (err) {
      console.error('Failed to read monthly summaries from localStorage:', err);
      return [];
    }
  },

  /**
   * Saves or replaces a monthly summary
   * @param {Object} summary
   * @returns {Object} Saved summary
   */
  saveMonthlySummary(summary) {
    const summaries = this.getMonthlySummaries();
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
      localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(summaries));
      return summaryData;
    } catch (err) {
      console.error('Failed to save monthly summary:', err);
      return null;
    }
  },

  /**
   * Updates an existing monthly summary
   * @param {string} id
   * @param {Object} updatedFields
   * @returns {Object|null}
   */
  updateMonthlySummary(id, updatedFields) {
    const summaries = this.getMonthlySummaries();
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
      localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(summaries));
      return updated;
    } catch (err) {
      console.error('Failed to update monthly summary:', err);
      return null;
    }
  },

  /**
   * Deletes a monthly summary by ID
   * @param {string} id
   * @returns {boolean}
   */
  deleteMonthlySummary(id) {
    const summaries = this.getMonthlySummaries();
    const filtered = summaries.filter(s => s.id !== id);
    if (filtered.length === summaries.length) return false;
    try {
      localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('Failed to delete monthly summary:', err);
      return false;
    }
  },

  /**
   * Exports all local diamond data and monthly summaries as a JSON-serializable object
   * @returns {Object} { version, exportedAt, records, monthlySummaries }
   */
  exportData() {
    const records = this.getRecords();
    const monthlySummaries = this.getMonthlySummaries();
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      records,
      monthlySummaries,
    };
  },

  /**
   * Imports diamond data from a JSON object
   * @param {Object} data
   * @param {string} mode 'replace' | 'merge'
   * @returns {{ success: boolean, recordsCount: number, summariesCount: number, error?: string }}
   */
  importData(data, mode = 'replace') {
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
        this.saveRecords(importedRecords);
        localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(importedSummaries));
      } else {
        // Merge mode: deduplicate by id
        const currentRecords = this.getRecords();
        const recordMap = new Map(currentRecords.map(r => [r.id, r]));
        importedRecords.forEach(r => recordMap.set(r.id, r));
        this.saveRecords(Array.from(recordMap.values()));

        const currentSummaries = this.getMonthlySummaries();
        const summaryMap = new Map(currentSummaries.map(s => [s.id, s]));
        importedSummaries.forEach(s => summaryMap.set(s.id, s));
        localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify(Array.from(summaryMap.values())));
      }

      return {
        success: true,
        recordsCount: importedRecords.length,
        summariesCount: importedSummaries.length,
      };
    } catch (err) {
      console.error('Import failed:', err);
      return { success: false, error: err.message || 'Unknown import error' };
    }
  },

  /**
   * Clears all local application data
   */
  clearAllData() {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify([]));
      localStorage.setItem(MONTHLY_SUMMARIES_KEY, JSON.stringify([]));
      return true;
    } catch (err) {
      console.error('Failed to clear data:', err);
      return false;
    }
  },

  /**
   * Gets approximate storage usage in KB
   * @returns {{ bytes: number, kb: string }}
   */
  getStorageUsage() {
    try {
      const records = localStorage.getItem(RECORDS_KEY) || '';
      const summaries = localStorage.getItem(MONTHLY_SUMMARIES_KEY) || '';
      const totalBytes = (records.length + summaries.length) * 2; // UTF-16
      return {
        bytes: totalBytes,
        kb: (totalBytes / 1024).toFixed(2),
      };
    } catch {
      return { bytes: 0, kb: '0.00' };
    }
  }
};
