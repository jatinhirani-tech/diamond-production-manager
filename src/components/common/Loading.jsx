import React from 'react';
import { Gem } from 'lucide-react';

export default function Loading({ message = 'Loading records...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <Gem className="w-6 h-6 text-indigo-600 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
