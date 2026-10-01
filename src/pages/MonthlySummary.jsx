import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calculator, History, Sparkles } from 'lucide-react';
import MonthlyCalculator from '../components/monthly/MonthlyCalculator';
import Button from '../components/common/Button';

export default function MonthlySummary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  const initialMonth = monthParam ? parseInt(monthParam, 10) : undefined;
  const initialYear = yearParam ? parseInt(yearParam, 10) : undefined;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monthly Ledger & Payroll</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Calculator className="w-7 h-7 text-indigo-600" />
            <span>Monthly Summary</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Sum individual diamond records, input your carat rate, and finalize monthly earnings
          </p>
        </div>

        <Button
          variant="secondary"
          icon={History}
          onClick={() => navigate('/history')}
          size="md"
        >
          View Saved History
        </Button>
      </div>

      {/* Main Calculator */}
      <MonthlyCalculator
        initialMonth={initialMonth}
        initialYear={initialYear}
      />
    </div>
  );
}
