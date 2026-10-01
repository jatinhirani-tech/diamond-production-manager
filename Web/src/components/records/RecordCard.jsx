import React from 'react';
import { Edit2, Trash2, Tag, FileText, Clock } from 'lucide-react';
import { formatCarat } from '../../utils/formatters';
import { SHAPE_BADGE_COLORS } from '../../constants/diamondShapes';

export default function RecordCard({ record, onEdit, onDelete }) {
  const shapeBadgeClass = SHAPE_BADGE_COLORS[record.shape] || SHAPE_BADGE_COLORS.Other;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Top row: Weight & Shape Badge */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono-numbers tracking-tight">
              {formatCarat(record.weight)}
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${shapeBadgeClass}`}>
                {record.shape}
              </span>
              
              {/* Unique ID status */}
              {record.hasUniqueId && record.packetId ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{record.packetId}</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-400 border border-slate-200/60">
                  No Unique ID
                </span>
              )}

              {/* Deposit status badge */}
              {record.isDeposited ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Deposited</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Not Deposited</span>
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(record)}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
              title="Edit Record"
              aria-label="Edit record"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(record)}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 focus:outline-none transition-colors"
              title="Delete Record"
              aria-label="Delete record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notes if present */}
        {record.notes && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-600">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed">{record.notes}</p>
          </div>
        )}
      </div>

      {/* Timestamp */}
      {record.createdAt && (
        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center gap-1 text-[10px] text-slate-400">
          <Clock className="w-3 h-3 text-slate-300" />
          <span>
            Logged {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  );
}
