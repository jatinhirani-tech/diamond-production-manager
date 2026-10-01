import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { SAMPLE_DATA } from '../utils/sampleData';

const DiamondContext = createContext(null);

export function DiamondProvider({ children }) {
  const [records, setRecords] = useState([]);
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const loadedRecords = storageService.getRecords();
    const loadedSummaries = storageService.getMonthlySummaries();
    setRecords(loadedRecords);
    setMonthlySummaries(loadedSummaries);
    setIsInitialized(true);
  }, []);

  // Toast notification system
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
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
  const addRecord = useCallback((recordData) => {
    const created = storageService.addRecord(recordData);
    setRecords(storageService.getRecords());
    showToast('Diamond added successfully', 'success');
    return created;
  }, [showToast]);

  const updateRecord = useCallback((id, updatedFields) => {
    const updated = storageService.updateRecord(id, updatedFields);
    if (updated) {
      setRecords(storageService.getRecords());
      showToast('Record updated successfully', 'success');
      return updated;
    }
    showToast('Failed to update record', 'error');
    return null;
  }, [showToast]);

  const deleteRecord = useCallback((id) => {
    const success = storageService.deleteRecord(id);
    if (success) {
      setRecords(storageService.getRecords());
      showToast('Record deleted', 'info');
      return true;
    }
    showToast('Failed to delete record', 'error');
    return false;
  }, [showToast]);

  // CRUD for Monthly Summaries
  const saveMonthlySummary = useCallback((summaryData) => {
    const saved = storageService.saveMonthlySummary(summaryData);
    if (saved) {
      setMonthlySummaries(storageService.getMonthlySummaries());
      showToast('Monthly summary saved', 'success');
      return saved;
    }
    showToast('Failed to save monthly summary', 'error');
    return null;
  }, [showToast]);

  const updateMonthlySummary = useCallback((id, updatedFields) => {
    const updated = storageService.updateMonthlySummary(id, updatedFields);
    if (updated) {
      setMonthlySummaries(storageService.getMonthlySummaries());
      showToast('Monthly summary updated', 'success');
      return updated;
    }
    showToast('Failed to update monthly summary', 'error');
    return null;
  }, [showToast]);

  const deleteMonthlySummary = useCallback((id) => {
    const success = storageService.deleteMonthlySummary(id);
    if (success) {
      setMonthlySummaries(storageService.getMonthlySummaries());
      showToast('Monthly summary deleted', 'info');
      return true;
    }
    showToast('Failed to delete monthly summary', 'error');
    return false;
  }, [showToast]);

  // Bulk actions
  const exportAllData = useCallback(() => {
    return storageService.exportData();
  }, []);

  const importAllData = useCallback((data, mode = 'replace') => {
    const result = storageService.importData(data, mode);
    if (result.success) {
      setRecords(storageService.getRecords());
      setMonthlySummaries(storageService.getMonthlySummaries());
      showToast(`Imported ${result.recordsCount} records & ${result.summariesCount} summaries`, 'success');
    } else {
      showToast(result.error || 'Import failed', 'error');
    }
    return result;
  }, [showToast]);

  const clearAllData = useCallback(() => {
    const success = storageService.clearAllData();
    if (success) {
      setRecords([]);
      setMonthlySummaries([]);
      showToast('All local diamond data cleared', 'info');
      return true;
    }
    showToast('Failed to clear data', 'error');
    return false;
  }, [showToast]);

  const resetToSampleData = useCallback(() => {
    storageService.saveRecords(SAMPLE_DATA.records);
    localStorage.setItem('diamond_monthly_summaries', JSON.stringify(SAMPLE_DATA.monthlySummaries));
    setRecords(SAMPLE_DATA.records);
    setMonthlySummaries(SAMPLE_DATA.monthlySummaries);
    showToast('Sample diamond records restored', 'success');
  }, [showToast]);

  const value = {
    records,
    monthlySummaries,
    isInitialized,
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
