import React, { useState, useEffect } from 'react';
import { Calculator, Save, RefreshCw, CheckCircle, ArrowRight, IndianRupee, Gem, Calendar } from 'lucide-react';
import { useDiamond } from '../../context/DiamondContext';
import { calculateMonthlyTotal, calculateTotalAmount, cleanFloat } from '../../utils/calculations';
import { formatCarat, formatCurrency, formatMonthYear, formatDate } from '../../utils/formatters';
import { validatePricePerCarat } from '../../utils/validation';
import Button from '../common/Button';

export default function MonthlyCalculator({ initialMonth, initialYear }) {
  const { records, monthlySummaries, saveMonthlySummary } = useDiamond();

  // Current date fallback
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(initialYear || currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialMonth || currentDate.getMonth() + 1);

  // Calculator State
  const [hasCalculated, setHasCalculated] = useState(false);
  const [totalDiamonds, setTotalDiamonds] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [monthRecords, setMonthRecords] = useState([]);
  const [pricePerCarat, setPricePerCarat] = useState('');
  const [priceError, setPriceError] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');

  // Check if this month is already saved in history
  const monthId = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const existingSummary = monthlySummaries.find(s => s.id === monthId);

  // When selected month/year changes or records change, check if we should pre-fill from existing summary
  useEffect(() => {
    if (existingSummary) {
      setPricePerCarat(String(existingSummary.pricePerCarat || ''));
      setSummaryNotes(existingSummary.notes || '');
    } else {
      setPricePerCarat('');
      setSummaryNotes('');
    }
    // Perform calculation
    performCalculation(false);
  }, [selectedMonth, selectedYear, existingSummary, records]);

  const performCalculation = (isUserClick = true) => {
    const { totalWeight: weight, totalDiamonds: count, records: mRecs } = calculateMonthlyTotal(
      records,
      selectedMonth,
      selectedYear
    );

    setTotalWeight(weight);
    setTotalDiamonds(count);
    setMonthRecords(mRecs);
    setHasCalculated(true);
  };

  // Live total amount calculation
  const numericPrice = Number(pricePerCarat) || 0;
  const totalAmount = calculateTotalAmount(totalWeight, numericPrice);

  const handlePriceChange = (val) => {
    setPricePerCarat(val);
    if (priceError) setPriceError('');
  };

  const handleSaveSummary = () => {
    const validation = validatePricePerCarat(pricePerCarat);
    if (!validation.isValid) {
      setPriceError(validation.error);
      return;
    }

    saveMonthlySummary({
      id: monthId,
      month: Number(selectedMonth),
      year: Number(selectedYear),
      totalDiamonds,
      totalWeight,
      pricePerCarat: Number(pricePerCarat),
      totalAmount,
      notes: summaryNotes,
    });
  };

  // Group month records by day for breakdown
  const dailyBreakdown = monthRecords.reduce((acc, rec) => {
    const dateKey = rec.date;
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        count: 0,
        weight: 0,
        diamonds: []
      };
    }
    acc[dateKey].count += 1;
    acc[dateKey].weight = cleanFloat(acc[dateKey].weight + (Number(rec.weight) || 0));
    acc[dateKey].diamonds.push(rec);
    return acc;
  }, {});

  const sortedDays = Object.values(dailyBreakdown).sort((a, b) => a.date.localeCompare(b.date));

  // Generate Year & Month selector options
  const years = Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 4 + i);
  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  const monthName = formatMonthYear(selectedYear, selectedMonth);

  // Check if saved summary is outdated compared to current live records
  const isOutOfSync = existingSummary && (
    existingSummary.totalWeight !== totalWeight ||
    existingSummary.totalDiamonds !== totalDiamonds
  );

  return (
    <div className="space-y-8">
      {/* Month & Year Selection Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Select Billing Month</h2>
            <p className="text-xs text-slate-500">Pick month and year to tally production records</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {months.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="flex-1 md:flex-initial bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Out of sync warning */}
      {isOutOfSync && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
            <span>
              <strong>Records updated:</strong> Saved summary ({formatCarat(existingSummary.totalWeight)}, {existingSummary.totalDiamonds} diamonds) differs from current records ({formatCarat(totalWeight)}, {totalDiamonds} diamonds).
            </span>
          </div>
          <button
            onClick={() => performCalculation(true)}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
          >
            Sync Recalculate
          </button>
        </div>
      )}

      {/* Prominent Calculate Button (Section 22) */}
      <div className="flex justify-center">
        <Button
          variant="luxury"
          size="xl"
          icon={Calculator}
          onClick={() => performCalculation(true)}
          className="w-full sm:w-auto px-10 py-4 text-lg font-bold shadow-lg"
        >
          Calculate Monthly Total for {monthName}
        </Button>
      </div>

      {/* Calculation Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Production Totals */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {monthName} Production
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-100">
                Sum of {totalDiamonds} Individual Records
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-500">Total Weight Produced</span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 mt-1 font-mono-numbers tracking-tight">
                  {formatCarat(totalWeight)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Accurately aggregated from every diamond logged in {monthName}.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Total Diamonds</span>
                  <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono-numbers">
                    {totalDiamonds} <span className="text-xs font-normal text-slate-500">Pcs</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Active Days</span>
                  <div className="text-2xl font-black text-slate-800 mt-0.5 font-mono-numbers">
                    {sortedDays.length} <span className="text-xs font-normal text-slate-500">Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Formula: Sum of each individual diamond weight in {monthName}</span>
          </div>
        </div>

        {/* Right: Price & Amount Calculation */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Price Calculation
              </span>
              <span className="text-xs text-slate-400">
                Formula: Weight × Price/CT
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {/* Price Per Carat Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Price Per Carat (₹ / CT) <span className="text-rose-400">*</span></span>
                  <span className="text-[11px] text-sky-300">e.g. ₹500, ₹525, ₹550</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-4 h-4 text-sky-400" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Enter rate per carat (e.g. 500)"
                    value={pricePerCarat}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-bold text-lg font-mono-numbers focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-500"
                  />
                </div>
                {priceError && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">{priceError}</p>
                )}
              </div>

              {/* Total Amount Display */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <span className="text-xs font-medium text-slate-400">Total Calculated Earnings</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 font-mono-numbers tracking-tight">
                  {formatCurrency(totalAmount)}
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>{formatCarat(totalWeight, false)} CT</span>
                  <span>×</span>
                  <span>₹{numericPrice > 0 ? numericPrice : 0}</span>
                  <span>=</span>
                  <span className="text-white font-bold">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Monthly Summary Action */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="success"
              size="lg"
              icon={Save}
              onClick={handleSaveSummary}
              disabled={totalDiamonds === 0}
              fullWidth
              className="py-3 font-bold"
            >
              {existingSummary ? 'Update Saved Monthly Summary' : 'Save Monthly Summary'}
            </Button>
          </div>
        </div>
      </div>

      {/* Daily Breakdown Accordion / Table */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Daily Breakdown — {monthName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual daily tallies comprising this month's total
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {sortedDays.length} working days
          </span>
        </div>

        {sortedDays.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            No diamond records logged in {monthName}.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedDays.map((day) => (
              <div key={day.date} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <div>
                    <span className="text-sm font-bold text-slate-900">{formatDate(day.date)}</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({day.count} {day.count === 1 ? 'diamond' : 'diamonds'})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-auto">
                  {/* Diamonds miniature chips */}
                  <div className="hidden md:flex items-center gap-1.5">
                    {day.diamonds.map((d, i) => (
                      <span key={d.id || i} className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {formatCarat(d.weight, false)} CT ({d.shape})
                      </span>
                    ))}
                  </div>

                  {/* Day Total Weight */}
                  <span className="text-sm font-black text-slate-900 font-mono-numbers">
                    {formatCarat(day.weight)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
