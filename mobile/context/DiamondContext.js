import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { SAMPLE_DATA } from '../utils/sampleData';

const DiamondContext = createContext(null);

export function DiamondProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from AsyncStorage on launch
  useEffect(() => {
    async function loadData() {
      try {
        const loadedRecords = await storageService.getRecords();
        const loadedSummaries = await storageService.getMonthlySummaries();
        setRecords(loadedRecords);
        setMonthlySummaries(loadedSummaries);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Mobile toast snackbar system
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // CRUD for Diamond Records
  const addRecord = useCallback(async (recordData) => {
    const created = await storageService.addRecord(recordData);
    const updatedRecords = await storageService.getRecords();
    setRecords(updatedRecords);
    showToast('Diamond added successfully', 'success');
    return created;
  }, [showToast]);

  const updateRecord = useCallback(async (id, updatedFields) => {
    const updated = await storageService.updateRecord(id, updatedFields);
    if (updated) {
      const updatedRecords = await storageService.getRecords();
      setRecords(updatedRecords);
      showToast('Record updated successfully', 'success');
      return updated;
    }
    showToast('Failed to update record', 'error');
    return null;
  }, [showToast]);

  const deleteRecord = useCallback(async (id) => {
    const success = await storageService.deleteRecord(id);
    if (success) {
      const updatedRecords = await storageService.getRecords();
      setRecords(updatedRecords);
      showToast('Record deleted', 'info');
      return true;
    }
    showToast('Failed to delete record', 'error');
    return false;
  }, [showToast]);

  // CRUD for Monthly Summaries
  const saveMonthlySummary = useCallback(async (summaryData) => {
    const saved = await storageService.saveMonthlySummary(summaryData);
    if (saved) {
      const updatedSummaries = await storageService.getMonthlySummaries();
      setMonthlySummaries(updatedSummaries);
      showToast('Monthly summary saved', 'success');
      return saved;
    }
    showToast('Failed to save monthly summary', 'error');
    return null;
  }, [showToast]);

  const updateMonthlySummary = useCallback(async (id, updatedFields) => {
    const updated = await storageService.updateMonthlySummary(id, updatedFields);
    if (updated) {
      const updatedSummaries = await storageService.getMonthlySummaries();
      setMonthlySummaries(updatedSummaries);
      showToast('Monthly summary updated', 'success');
      return updated;
    }
    showToast('Failed to update monthly summary', 'error');
    return null;
  }, [showToast]);

  const deleteMonthlySummary = useCallback(async (id) => {
    const success = await storageService.deleteMonthlySummary(id);
    if (success) {
      const updatedSummaries = await storageService.getMonthlySummaries();
      setMonthlySummaries(updatedSummaries);
      showToast('Monthly summary deleted', 'info');
      return true;
    }
    showToast('Failed to delete monthly summary', 'error');
    return false;
  }, [showToast]);

  // Bulk actions
  const exportAllData = useCallback(async () => {
    return await storageService.exportData();
  }, []);

  const importAllData = useCallback(async (data, mode = 'replace') => {
    const result = await storageService.importData(data, mode);
    if (result.success) {
      const updatedRecords = await storageService.getRecords();
      const updatedSummaries = await storageService.getMonthlySummaries();
      setRecords(updatedRecords);
      setMonthlySummaries(updatedSummaries);
      showToast(`Imported ${result.recordsCount} records & ${result.summariesCount} summaries`, 'success');
    } else {
      showToast(result.error || 'Import failed', 'error');
    }
    return result;
  }, [showToast]);

  const clearAllData = useCallback(async () => {
    const success = await storageService.clearAllData();
    if (success) {
      setRecords([]);
      setMonthlySummaries([]);
      showToast('All local diamond data cleared', 'info');
      return true;
    }
    showToast('Failed to clear data', 'error');
    return false;
  }, [showToast]);

  const resetToSampleData = useCallback(async () => {
    await storageService.saveRecords(SAMPLE_DATA.records);
    for (const summary of SAMPLE_DATA.monthlySummaries) {
      await storageService.saveMonthlySummary(summary);
    }
    const updatedRecords = await storageService.getRecords();
    const updatedSummaries = await storageService.getMonthlySummaries();
    setRecords(updatedRecords);
    setMonthlySummaries(updatedSummaries);
    showToast('Sample diamond records loaded', 'success');
  }, [showToast]);

  const value = {
    records,
    monthlySummaries,
    isLoading,
    toasts,
    showToast,
    removeToast,
    addRecord,
    updateRecord,
    deleteRecord,
    saveMonthlySummary,
    updateMonthlySummary,
    deleteMonthlySummary,
    exportAllData,
    importAllData,
    clearAllData,
    resetToSampleData,
  };

  return (
    <DiamondContext.Provider value={value}>
      {children}
    </DiamondContext.Provider>
  );
}

export function useDiamond() {
  const context = useContext(DiamondContext);
  if (!context) {
    throw new Error('useDiamond must be used within a DiamondProvider');
  }
  return context;
}
