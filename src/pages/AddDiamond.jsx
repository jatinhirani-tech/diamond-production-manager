import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Gem, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDiamond } from '../context/DiamondContext';
import { getTodayRecords, calculateTotalWeight } from '../utils/calculations';
import { formatCarat, formatNumber, getTodayDateString, formatDate } from '../utils/formatters';
import RecordForm from '../components/records/RecordForm';

export default function AddDiamond() {
  const navigate = useNavigate();
  const { records, addRecord } = useDiamond();

  const todayStr = getTodayDateString();
  const todayRecords = getTodayRecords(records);
  const todayTotalWeight = calculateTotalWeight(todayRecords);

  const handleSubmit = (recordData, andAddAnother) => {
    addRecord(recordData);
    if (!andAddAnother) {
      navigate('/records');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top navigation & heading */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Crafting Entry Form
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" />
              <span>Record New Diamond</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add individual diamond details into your local diary
            </p>
          </div>

          <RecordForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/records')}
            showAddAnother={true}
          />
        </div>

        {/* Right Helper / Running Today Total */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Logged Total</span>
            </div>
            <p className="text-xs text-slate-400">
              {formatDate(todayStr)}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Pieces Crafted:</span>
                <p className="text-2xl font-black text-white font-mono-numbers">
                  {formatNumber(todayRecords.length)} <span className="text-xs font-normal text-slate-400">Diamonds</span>
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">Accumulated Carats:</span>
                <p className="text-2xl font-black text-sky-300 font-mono-numbers">
                  {formatCarat(todayTotalWeight)}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed pt-3 border-t border-slate-800/80">
              Tip: Use <strong>"Save & Add Another"</strong> if you are logging multiple diamonds from a session.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-indigo-600" />
              <span>Diamond Artisan Note</span>
            </h4>
            <p className="text-slate-500 leading-relaxed">
              Every diamond is stored with full decimal precision. You can record unlimited diamonds on any date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
