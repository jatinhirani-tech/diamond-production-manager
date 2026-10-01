import React, { useState } from 'react';
import { ArrowRight, Trash2, RefreshCw, Eye, IndianRupee, Gem, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCarat, formatCurrency, formatMonthYear, formatDate } from '../../utils/formatters';
import { calculateMonthlyTotal, calculateTotalAmount } from '../../utils/calculations';
import { useDiamond } from '../../context/DiamondContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function MonthlyHistoryCard({
  summary,
  onDeleteRequest,
}) {
  const navigate = useNavigate();
  const { records, updateMonthlySummary } = useDiamond();
  const [showDetails, setShowDetails] = useState(false);

  const monthLabel = formatMonthYear(summary.year, summary.month);

  // Recalculate live records for comparison
  const currentLive = calculateMonthlyTotal(records, summary.month, summary.year);
  const isOutOfSync = currentLive.totalWeight !== summary.totalWeight ||
                      currentLive.totalDiamonds !== summary.totalDiamonds ||
                      (summary.depositedWeight !== undefined && currentLive.depositedWeight !== summary.depositedWeight) ||
                      (summary.depositedDiamonds !== undefined && currentLive.depositedDiamonds !== summary.depositedDiamonds);

  // Handle in-place recalculation based on deposited weight
  const handleRecalculate = () => {
    const updatedAmount = calculateTotalAmount(currentLive.depositedWeight, summary.pricePerCarat);
    updateMonthlySummary(summary.id, {
      totalWeight: currentLive.totalWeight,
      totalDiamonds: currentLive.totalDiamonds,
      depositedWeight: currentLive.depositedWeight,
      depositedDiamonds: currentLive.depositedDiamonds,
      totalAmount: updatedAmount,
    });
  };

  // Group current records by date for the details modal breakdown
  const dailyGroups = currentLive.records.reduce((acc, rec) => {
    if (!acc[rec.date]) {
      acc[rec.date] = { date: rec.date, weight: 0, diamonds: [] };
    }
    acc[rec.date].weight += Number(rec.weight) || 0;
    acc[rec.date].diamonds.push(rec);
    return acc;
  }, {});

  const sortedDailyList = Object.values(dailyGroups).sort((a, b) => a.date.localeCompare(b.date));

  const depWeight = summary.depositedWeight !== undefined ? summary.depositedWeight : summary.totalWeight;
  const depDiamonds = summary.depositedDiamonds !== undefined ? summary.depositedDiamonds : summary.totalDiamonds;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle hover:shadow-premium hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group">
        <div>
          {/* Card Header: Month Name & Sync Status */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {monthLabel}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved on {formatDate(summary.savedAt)}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {isOutOfSync && (
                <button
                  onClick={handleRecalculate}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                  title="Click to recalculate based on updated records"
                >
                  <RefreshCw className="w-3 h-3 text-amber-600" />
                  <span>Update Needed</span>
                </button>
              )}
              <button
                onClick={() => onDeleteRequest(summary)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Monthly Summary"
                aria-label="Delete month"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-5 space-y-4">
            {/* Total Production & Deposited Production */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Production
                </span>
                <div className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 font-mono-numbers">
                  {formatCarat(summary.totalWeight)}
                </div>
                <span className="text-[11px] text-slate-500">{summary.totalDiamonds} Diamonds</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Deposited</span>
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5 font-mono-numbers">
                  {formatCarat(depWeight)}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">{depDiamonds} Deposited</span>
              </div>
            </div>

            {/* Price / CT and Total Amount */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs font-medium text-slate-400">Price / CT</span>
                <div className="text-base font-bold text-slate-700 mt-0.5 font-mono-numbers">
                  ₹{summary.pricePerCarat}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400">Total Wages</span>
                <div className="text-lg font-black text-emerald-600 mt-0.5 font-mono-numbers">
                  {formatCurrency(summary.totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowDetails(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group-hover:underline"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate(`/monthly?month=${summary.month}&year=${summary.year}`)}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Edit in Calculator
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title={`Monthly Breakdown — ${monthLabel}`}
          subtitle="Complete record summary and daily production breakdown"
          maxWidth="max-w-xl"
        >
          <div className="space-y-6">
            {/* Top KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Diamonds</p>
                <p className="text-lg font-bold text-slate-900 font-mono-numbers">{summary.totalDiamonds}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Weight</p>
                <p className="text-lg font-bold text-indigo-700 font-mono-numbers">{formatCarat(summary.totalWeight)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Rate / CT</p>
                <p className="text-lg font-bold text-slate-900 font-mono-numbers">₹{summary.pricePerCarat}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Total Earnings</p>
                <p className="text-lg font-bold text-emerald-600 font-mono-numbers">{formatCurrency(summary.totalAmount)}</p>
              </div>
            </div>

            {/* Live out-of-sync banner in modal */}
            {isOutOfSync && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span>Underlying records changed. Recalculate to sync?</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={RefreshCw}
                  onClick={handleRecalculate}
                >
                  Recalculate
                </Button>
              </div>
            )}

            {/* Daily Breakdown List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Daily Breakdown
              </h4>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
                {sortedDailyList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No individual diamond records found for this month.</p>
                ) : (
                  sortedDailyList.map((day) => (
                    <div key={day.date} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{formatDate(day.date)}</span>
                        <span className="text-slate-400 ml-2">({day.diamonds.length} pcs)</span>
                      </div>
                      <span className="font-bold text-slate-900 font-mono-numbers">{formatCarat(day.weight)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {summary.notes && (
              <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Notes:</span> {summary.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowDetails(false);
                  navigate(`/monthly?month=${summary.month}&year=${summary.year}`);
                }}
              >
                Open in Calculator
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
