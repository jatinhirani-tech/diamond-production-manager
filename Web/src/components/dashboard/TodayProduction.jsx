import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles, Gem } from 'lucide-react';
import { formatCarat, formatNumber, formatDate, getTodayDateString } from '../../utils/formatters';
import { SHAPE_BADGE_COLORS } from '../../constants/diamondShapes';

export default function TodayProduction({ todayRecords = [] }) {
  const navigate = useNavigate();
  const todayStr = getTodayDateString();
  const todayFormatted = formatDate(todayStr);

  const totalWeight = todayRecords.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  const count = todayRecords.length;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Diamond Shimmer Pattern */}
      <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
        <Gem className="w-56 h-56 text-sky-300" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Production</span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            {todayFormatted}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Quantity</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 font-mono-numbers">
              {formatNumber(count)} <span className="text-sm font-normal text-slate-300">Diamonds</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Weight</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-300 mt-0.5 font-mono-numbers">
              {formatCarat(totalWeight)}
            </div>
          </div>
        </div>

        {/* Today's Mini Preview if records exist */}
        {count > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-2">Today's Diamonds:</p>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-1">
              {todayRecords.slice(0, 6).map((rec) => (
                <span
                  key={rec.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-xs text-slate-200 border border-slate-700/70"
                >
                  <span className="font-bold text-white font-mono-numbers">{formatCarat(rec.weight)}</span>
                  <span className="text-slate-400 text-[11px]">• {rec.shape}</span>
                  {rec.hasUniqueId && rec.packetId && (
                    <span className="text-sky-300 text-[10px]">({rec.packetId})</span>
                  )}
                </span>
              ))}
              {count > 6 && (
                <span className="px-2 py-1 rounded-lg bg-slate-800 text-xs text-slate-400">
                  +{count - 6} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => navigate(`/records?date=${todayStr}`)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white transition-colors group"
        >
          <span>View all today's records</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/add')}
          className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add Today
        </button>
      </div>
    </div>
  );
}
