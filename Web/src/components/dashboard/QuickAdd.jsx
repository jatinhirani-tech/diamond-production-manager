import React, { useState } from 'react';
import { Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDiamond } from '../../context/DiamondContext';
import { DIAMOND_SHAPES } from '../../constants/diamondShapes';
import { getTodayDateString } from '../../utils/formatters';
import Button from '../common/Button';

export default function QuickAdd() {
  const { addRecord } = useDiamond();
  const [weight, setWeight] = useState('');
  const [shape, setShape] = useState('Round');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numWeight = Number(weight);
    if (!weight || isNaN(numWeight) || numWeight <= 0) {
      setError('Please enter a valid weight > 0');
      return;
    }

    addRecord({
      date: getTodayDateString(),
      weight: numWeight,
      shape: shape,
      hasUniqueId: false,
      packetId: null,
      notes: 'Quick added from Dashboard',
    });

    setWeight('');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Quick Add Diamond</h3>
              <p className="text-xs text-slate-500">Record a diamond made today</p>
            </div>
          </div>
          <Link
            to="/add"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>Full Form</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (CT) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 4.50"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold font-mono-numbers focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                  CT
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shape
              </label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition-all"
              >
                {DIAMOND_SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Plus}
            fullWidth
            className="mt-2"
          >
            Add Diamond to Today
          </Button>
        </form>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-3">
        Date defaults to today. For packet IDs and notes, open the full form.
      </p>
    </div>
  );
}
