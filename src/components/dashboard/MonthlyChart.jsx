import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { formatCarat, formatNumber } from '../../utils/formatters';

export default function MonthlyChart({ trendData = [] }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Find max weight to scale bars proportionally
  const maxWeight = Math.max(...trendData.map(d => d.weight || 0), 10);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Production Weight by Month</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total carats produced across recent months
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
          Last {trendData.length} Months
        </span>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-8 pb-2">
        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-200 px-2">
          {trendData.map((item) => {
            const heightPercent = maxWeight > 0 ? Math.max((item.weight / maxWeight) * 100, 4) : 4;
            const isHovered = hoveredMonth?.key === item.key;

            return (
              <div
                key={item.key}
                className="flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Floating tooltip */}
                <div
                  className={`absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1 pointer-events-none shadow-lg whitespace-nowrap transition-all duration-150 ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sky-300 font-mono-numbers">{formatCarat(item.weight)} ({item.count} pcs)</p>
                </div>

                {/* Weight value above bar */}
                <span className="text-[11px] font-bold text-slate-700 font-mono-numbers mb-1.5 opacity-90 group-hover:text-indigo-600 transition-colors">
                  {item.weight > 0 ? `${formatCarat(item.weight, false)}` : '0'}
                </span>

                {/* The Bar */}
                <div className="w-full max-w-[44px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.weight > 0
                        ? isHovered
                          ? 'bg-gradient-to-t from-indigo-700 to-sky-400 shadow-md shadow-indigo-500/20'
                          : 'bg-gradient-to-t from-slate-900 via-indigo-900 to-indigo-600'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>

                {/* Month Label */}
                <span className="text-[11px] font-semibold text-slate-600 mt-2 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Unit: Carats (CT)</span>
        <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time calculation from daily entries</span>
        </div>
      </div>
    </div>
  );
}
