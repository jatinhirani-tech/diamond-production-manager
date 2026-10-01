import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gem, 
  Scale, 
  CalendarRange, 
  IndianRupee, 
  Plus, 
  ArrowRight, 
  Sparkles,
  Layers,
  History
} from 'lucide-react';
import { useDiamond } from '../context/DiamondContext';
import { 
  calculateTotalWeight, 
  getMonthlyRecords, 
  getTodayRecords,
  getMonthlyProductionTrend,
  calculateTotalAmount
} from '../utils/calculations';
import { 
  formatCarat, 
  formatCurrency, 
  formatNumber, 
  formatDate,
  formatMonthYear
} from '../utils/formatters';
import StatCard from '../components/dashboard/StatCard';
import TodayProduction from '../components/dashboard/TodayProduction';
import MonthlyChart from '../components/dashboard/MonthlyChart';
import QuickAdd from '../components/dashboard/QuickAdd';
import Button from '../components/common/Button';
import { SHAPE_BADGE_COLORS } from '../constants/diamondShapes';

export default function Dashboard() {
  const navigate = useNavigate();
  const { records, monthlySummaries } = useDiamond();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Determine time-based greeting
  const hour = currentDate.getHours();
  let greeting = 'Good Morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
  } else if (hour >= 17) {
    greeting = 'Good Evening';
  }

  // Live metrics calculations
  const totalDiamonds = records.length;
  const totalWeight = useMemo(() => calculateTotalWeight(records), [records]);

  // Today's records
  const todayRecords = useMemo(() => getTodayRecords(records), [records]);
  const todayWeight = useMemo(() => calculateTotalWeight(todayRecords), [todayRecords]);

  // Current Month records & weight
  const currentMonthRecords = useMemo(() => 
    getMonthlyRecords(records, currentMonth, currentYear), 
    [records, currentMonth, currentYear]
  );
  const currentMonthWeight = useMemo(() => 
    calculateTotalWeight(currentMonthRecords), 
    [currentMonthRecords]
  );

  // Current Month Earnings: check saved summary price or default price if not saved yet
  const currentMonthSummary = useMemo(() => {
    const id = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return monthlySummaries.find(s => s.id === id);
  }, [monthlySummaries, currentYear, currentMonth]);

  const currentMonthEarnings = useMemo(() => {
    if (currentMonthSummary) {
      return calculateTotalAmount(currentMonthWeight, currentMonthSummary.pricePerCarat);
    }
    // Fallback: use most recent saved summary's rate if available, or ₹500
    const latestRate = monthlySummaries[0]?.pricePerCarat || 500;
    return calculateTotalAmount(currentMonthWeight, latestRate);
  }, [currentMonthSummary, currentMonthWeight, monthlySummaries]);

  // Monthly trend for the chart
  const monthlyTrendData = useMemo(() => 
    getMonthlyProductionTrend(records, 6), 
    [records]
  );

  // Recent 5 entries
  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date))
      .slice(0, 5);
  }, [records]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diamond Artisan Overview</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {greeting}, Maheshbhai Hirani
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time digital ledger and precision monthly earnings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            icon={History}
            onClick={() => navigate('/history')}
            size="md"
          >
            History
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/add')}
            size="md"
            className="shadow-md"
          >
            Add Diamond
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Diamonds"
          value={formatNumber(totalDiamonds)}
          subvalue={`${todayRecords.length} crafted today`}
          icon={Layers}
          iconBg="bg-sky-50 text-sky-600"
          onClick={() => navigate('/records')}
        />

        <StatCard
          title="Total Weight"
          value={formatCarat(totalWeight)}
          subvalue="All-time cumulative weight"
          icon={Scale}
          iconBg="bg-indigo-50 text-indigo-600"
          onClick={() => navigate('/records')}
        />

        <StatCard
          title="This Month"
          value={formatCarat(currentMonthWeight)}
          subvalue={`${currentMonthRecords.length} diamonds in ${formatMonthYear(currentYear, currentMonth)}`}
          icon={CalendarRange}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => navigate(`/monthly?month=${currentMonth}&year=${currentYear}`)}
        />

        <StatCard
          title="Earnings (Est.)"
          value={formatCurrency(currentMonthEarnings)}
          subvalue={currentMonthSummary ? `Locked at ₹${currentMonthSummary.pricePerCarat}/CT` : `Est. based on ₹${monthlySummaries[0]?.pricePerCarat || 500}/CT`}
          icon={IndianRupee}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => navigate('/monthly')}
        />
      </div>

      {/* Row 2: Today's Production & Quick Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodayProduction todayRecords={todayRecords} />
        </div>
        <div className="lg:col-span-1">
          <QuickAdd />
        </div>
      </div>

      {/* Row 3: Monthly Production Chart */}
      <div>
        <MonthlyChart trendData={monthlyTrendData} />
      </div>

      {/* Row 4: Recent Logged Diamonds */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Gem className="w-4 h-4 text-indigo-600" />
              <span>Recently Logged Diamonds</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest individual pieces saved to the diary
            </p>
          </div>
          <button
            onClick={() => navigate('/records')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No diamond records logged yet. Use the Quick Add above or click "+ Add Diamond".
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentRecords.map((rec) => {
              const badgeClass = SHAPE_BADGE_COLORS[rec.shape] || SHAPE_BADGE_COLORS.Other;
              return (
                <div
                  key={rec.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate('/records')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                      <Gem className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 font-mono-numbers">
                          {formatCarat(rec.weight)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                          {rec.shape}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(rec.date)} {rec.hasUniqueId && rec.packetId ? `• ID: ${rec.packetId}` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-indigo-600 hover:underline">
                    View →
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
