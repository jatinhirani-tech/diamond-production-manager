import React from 'react';
import { Gem, PlusCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Gem,
  title = 'No records found',
  description = 'Start by adding your first diamond record.',
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-subtle ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-slate-200">
        <Icon className="w-8 h-8 text-indigo-500/80" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={onAction}
          size="md"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
