import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Plus, Scale, IndianRupee, CalendarCheck, Gem, Sparkles } from 'lucide-react';
import { useDiamond } from '../context/DiamondContext';
import { calculateLifetimeProduction, calculateLifetimeEarnings } from '../utils/calculations';
import { formatCarat, formatCurrency, formatNumber } from '../utils/formatters';
import MonthlyHistoryCard from '../components/monthly/MonthlyHistoryCard';
import DeleteConfirmModal from '../components/records/DeleteConfirmModal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export default function MonthlyHistory() {
  const navigate = useNavigate();
  const { monthlySummaries, deleteMonthlySummary } = useDiamond();

  const [deletingSummary, setDeletingSummary] = useState(null);

  // Lifetime metrics calculated across saved summaries (Section 31 & 56)
  const lifetimeProduction = useMemo(() => 
    calculateLifetimeProduction(monthlySummaries), 
    [monthlySummaries]
  );

  const lifetimeEarnings = useMemo(() => 
    calculateLifetimeEarnings(monthlySummaries), 
    [monthlySummaries]
  );

  const totalSavedMonths = monthlySummaries.length;

  const handleDeleteConfirm = () => {
    if (!deletingSummary) return;
    deleteMonthlySummary(deletingSummary.id);
    setDeletingSummary(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Historical Records</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <History className="w-7 h-7 text-indigo-600" />
            <span>Monthly History</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Archive of finalized monthly production totals, rates, and earnings
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/monthly')}
          size="md"
          className="shadow-md"
        >
          New Monthly Calculation
        </Button>
      </div>

      {/* Lifetime Summary KPI Cards (Section 31) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <Scale className="w-32 h-32" />
          </div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Lifetime Production
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white mt-1.5 font-mono-numbers tracking-tight">
            {formatCarat(lifetimeProduction)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across {totalSavedMonths} archived months
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <IndianRupee className="w-32 h-32 text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Lifetime Earnings
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-300 mt-1.5 font-mono-numbers tracking-tight">
            {formatCurrency(lifetimeEarnings)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total wages earned from diamond craft
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saved Archives
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1.5 font-mono-numbers">
              {formatNumber(totalSavedMonths)} <span className="text-sm font-normal text-slate-500">Months</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Archived closures stored safely in local storage
          </p>
        </div>
      </div>

      {/* Monthly Cards List (Newest first) */}
      {monthlySummaries.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No monthly summaries yet"
          description="Complete your first monthly calculation to see it here. Monthly summaries freeze production carats and payout rates."
          actionText="Go to Monthly Calculator"
          onAction={() => navigate('/monthly')}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Archived Months ({monthlySummaries.length})
            </h2>
            <span className="text-xs text-slate-400">
              Newest Months First
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlySummaries.map((summary) => (
              <MonthlyHistoryCard
                key={summary.id}
                summary={summary}
                onDeleteRequest={setDeletingSummary}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Monthly Summary Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingSummary)}
        onClose={() => setDeletingSummary(null)}
        onConfirm={handleDeleteConfirm}
        isMonthlySummary={true}
      />
    </div>
  );
}
