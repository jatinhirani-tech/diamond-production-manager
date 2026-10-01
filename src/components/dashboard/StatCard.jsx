import React from 'react';

export default function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  trend,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle hover:shadow-premium transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono-numbers">
          {value}
        </div>
        {subvalue && (
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
            {trend && <span className="font-semibold text-emerald-600">{trend}</span>}
            <span>{subvalue}</span>
          </p>
        )}
      </div>
    </div>
  );
}
