import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { formatCarat, formatDate } from '../../utils/formatters';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  record,
  isMonthlySummary = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      showCloseButton={true}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {isMonthlySummary ? 'Delete Monthly Summary?' : 'Delete Diamond?'}
        </h3>

        <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
          {isMonthlySummary
            ? 'Are you sure you want to delete this saved monthly summary? Diamond records for this month will remain intact.'
            : 'Are you sure you want to delete this diamond record? This action will immediately update your daily and monthly totals.'}
        </p>

        {/* Record preview if available */}
        {record && !isMonthlySummary && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 w-full text-left text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Date:</span>
              <span className="font-semibold text-slate-800">{formatDate(record.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Weight:</span>
              <span className="font-bold text-indigo-700 font-mono-numbers">{formatCarat(record.weight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-500">Shape:</span>
              <span className="font-semibold text-slate-800">{record.shape}</span>
            </div>
            {record.hasUniqueId && record.packetId && (
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Packet ID:</span>
                <span className="font-mono text-slate-800 font-semibold">{record.packetId}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            size="md"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            icon={Trash2}
            size="md"
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
