import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder="Search by packet ID, weight (e.g. 4.5), shape, date (e.g. 03 Oct), or notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-subtle"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
