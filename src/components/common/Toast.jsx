import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useDiamond } from '../../context/DiamondContext';

export default function Toast() {
  const { toasts, removeToast } = useDiamond();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700/60 transform transition-all duration-300 animate-slideInRight"
            role="alert"
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {isInfo && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <p className="text-sm font-medium text-slate-100">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
