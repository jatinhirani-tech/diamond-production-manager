import React, { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  HardDrive, 
  ShieldCheck, 
  AlertTriangle, 
  Database, 
  FileJson, 
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { useDiamond } from '../context/DiamondContext';
import { storageService } from '../services/storageService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function Settings() {
  const { 
    records, 
    monthlySummaries, 
    exportAllData, 
    importAllData, 
    clearAllData, 
    resetToSampleData 
  } = useDiamond();

  const fileInputRef = useRef(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importPreview, setImportPreview] = useState(null);
  const [importMode, setImportMode] = useState('replace');
  const [statusMessage, setStatusMessage] = useState(null);

  const storageUsage = storageService.getStorageUsage();

  // Export all data as JSON
  const handleExport = () => {
    const data = exportAllData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const nowStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `diamond_production_backup_${nowStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMessage({
      type: 'success',
      text: `Backup exported successfully (${data.records.length} records, ${data.monthlySummaries.length} summaries)`
    });
  };

  // Handle file select for import
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const recs = Array.isArray(parsed.records) ? parsed.records : [];
        const sums = Array.isArray(parsed.monthlySummaries) ? parsed.monthlySummaries : [];

        if (recs.length === 0 && sums.length === 0) {
          alert('No valid diamond records or monthly summaries found in JSON file.');
          return;
        }

        setImportPreview({
          data: parsed,
          recordsCount: recs.length,
          summariesCount: sums.length,
          fileName: file.name
        });
      } catch (err) {
        alert('Invalid JSON file format. Please ensure you are uploading a valid Diamond Production backup.');
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    importAllData(importPreview.data, importMode);
    setStatusMessage({
      type: 'success',
      text: `Restored ${importPreview.recordsCount} diamond records and ${importPreview.summariesCount} monthly summaries.`
    });
    setImportPreview(null);
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearModal(false);
    setStatusMessage({
      type: 'info',
      text: 'All records and summaries have been deleted from local storage.'
    });
  };

  const handleLoadSample = () => {
    resetToSampleData();
    setStatusMessage({
      type: 'success',
      text: 'Realistic sample records loaded (Oct 2026, Sep 2026, Aug 2026, Jul 2026).'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Database className="w-7 h-7 text-indigo-600" />
          <span>Application Settings & Data</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your local database, backup copies, import files, and device storage
        </p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center justify-between animate-fadeIn ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-800 border border-slate-200'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-bold underline ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Local Storage Privacy Notice (Section 41) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">100% Local Storage Architecture</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your diamond production records and earnings are stored <strong>strictly on this device and browser</strong>.
              No cloud database, remote server, or external API is used. Your sensitive manufacturing logs and pricing data remain entirely private.
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-sky-300">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4" /> Browser Storage Used: <strong>{storageUsage.kb} KB</strong>
              </span>
              <span>•</span>
              <span>Current Records: <strong>{records.length}</strong></span>
              <span>•</span>
              <span>Monthly Closures: <strong>{monthlySummaries.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Export Backup File
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Download your entire diary (all diamond entries and monthly summaries) as a single JSON file. You can save this to your phone, pendrive, or email for safekeeping.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {records.length} records ready
            </span>
            <Button
              variant="primary"
              icon={Download}
              onClick={handleExport}
              size="md"
            >
              Export JSON
            </Button>
          </div>
        </div>

        {/* Import Data */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Restore / Import Data
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Select a previously exported JSON backup file to restore your diamond records and monthly summaries onto this or another device.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs text-slate-400">
              Valid JSON format
            </span>
            <Button
              variant="secondary"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
              size="md"
            >
              Select File
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Data & Danger Zone */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Database Maintenance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset or load sample data for demonstrations
          </p>
        </div>

        <div className="pt-2 divide-y divide-slate-100">
          {/* Sample Data row */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Load Realistic Demo Records
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Populate sample records (10+ diamonds across Oct 2026, Sep 2026, etc. with historical summaries).
              </p>
            </div>
            <Button
              variant="secondary"
              icon={RefreshCcw}
              onClick={handleLoadSample}
              size="sm"
            >
              Load Demo Records
            </Button>
          </div>

          {/* Clear All Data row (Section 40) */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Clear All Data</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete all diamond records and monthly summaries from this browser.
              </p>
            </div>
            <Button
              variant="dangerOutline"
              icon={Trash2}
              onClick={() => setShowClearModal(true)}
              size="sm"
            >
              Clear Everything
            </Button>
          </div>
        </div>
      </div>

      {/* Import Confirmation Preview Modal */}
      {importPreview && (
        <Modal
          isOpen={Boolean(importPreview)}
          onClose={() => setImportPreview(null)}
          title="Confirm Data Import"
          subtitle={`File: ${importPreview.fileName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Diamond Records found:</span>
                <span className="font-bold text-slate-900">{importPreview.recordsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Summaries found:</span>
                <span className="font-bold text-slate-900">{importPreview.summariesCount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Import Mode:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-3 rounded-xl border text-left font-medium transition-all ${
                    importMode === 'replace'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">Replace</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Overwrite existing records with file</p>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-3 rounded-xl border text-left font-medium transition-all ${
                    importMode === 'merge'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">Merge</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Combine file with current records</p>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setImportPreview(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmImport}
              >
                Confirm Import
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Clear All Data Strong Confirmation Modal (Section 40) */}
      {showClearModal && (
        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Delete All Data?
            </h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
              This will permanently remove <strong>all diamond records</strong> and <strong>monthly summaries</strong> from this browser. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 w-full">
              <Button
                variant="secondary"
                onClick={() => setShowClearModal(false)}
                size="md"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleClearAll}
                size="md"
                className="flex-1"
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
