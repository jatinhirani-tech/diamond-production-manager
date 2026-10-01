import React from 'react';
import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import { DIAMOND_SHAPES } from '../../constants/diamondShapes';

export default function FilterBar({
  shapeFilter,
  onShapeFilterChange,
  uniqueIdFilter,
  onUniqueIdFilterChange,
  depositFilter = 'All',
  onDepositFilterChange,
  dateFilter,
  onDateFilterChange,
  sortOption,
  onSortOptionChange,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-subtle flex flex-wrap items-center gap-3">
      {/* Shape Filter */}
      <div className="flex items-center gap-1.5 min-w-[130px] flex-1 sm:flex-initial">
        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Shape:</label>
        <select
          value={shapeFilter}
          onChange={(e) => onShapeFilterChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Shapes</option>
          {DIAMOND_SHAPES.map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>

      {/* Unique ID Filter */}
      <div className="flex items-center gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Packet:</label>
        <select
          value={uniqueIdFilter}
          onChange={(e) => onUniqueIdFilterChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Packets</option>
          <option value="HasUniqueId">Has Unique ID</option>
          <option value="NoUniqueId">No Unique ID</option>
        </select>
      </div>

      {/* Deposit Status Filter */}
      <div className="flex items-center gap-1.5 min-w-[130px] flex-1 sm:flex-initial">
        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Deposit:</label>
        <select
          value={depositFilter}
          onChange={(e) => onDepositFilterChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Deposited">Deposited</option>
          <option value="NotDeposited">Not Deposited</option>
        </select>
      </div>

      {/* Specific Date Filter */}
      <div className="flex items-center gap-1.5 min-w-[150px] flex-1 sm:flex-initial">
        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Sort Option */}
      <div className="flex items-center gap-1.5 min-w-[160px] flex-1 sm:flex-initial sm:ml-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="weight_desc">Weight High → Low</option>
          <option value="weight_asc">Weight Low → High</option>
        </select>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
