import { getTodayDateString } from './formatters.js';

/**
 * Normalizes floating point numbers to avoid 16.199999999999996 bugs
 * @param {number} num
 * @param {number} decimals
 * @returns {number}
 */
export function cleanFloat(num, decimals = 4) {
  if (typeof num !== 'number' || isNaN(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Calculates sum of weights for a given list of records
 * @param {Array} records
 * @returns {number}
 */
export function calculateTotalWeight(records = []) {
  if (!Array.isArray(records)) return 0;
  const sum = records.reduce((acc, curr) => {
    const w = Number(curr?.weight) || 0;
    return acc + w;
  }, 0);
  return cleanFloat(sum);
}

/**
 * Calculates total weight of records on a specific date (YYYY-MM-DD)
 * @param {Array} records
 * @param {string} date
 * @returns {{ weight: number, count: number, records: Array }}
 */
export function calculateDailyTotal(records = [], date) {
  if (!date || !Array.isArray(records)) return { weight: 0, count: 0, records: [] };
  const filtered = records.filter(r => r.date === date);
  return {
    weight: calculateTotalWeight(filtered),
    count: filtered.length,
    records: filtered
  };
}

/**
 * Filters records for a given month and year
 * @param {Array} records
 * @param {number|string} month (1-12)
 * @param {number|string} year (e.g. 2026)
 * @returns {Array}
 */
export function getMonthlyRecords(records = [], month, year) {
  if (!Array.isArray(records)) return [];
  const targetYear = Number(year);
  const targetMonth = Number(month);

  return records.filter(record => {
    if (!record?.date) return false;
    const parts = record.date.split('-');
    if (parts.length < 2) return false;
    const recYear = parseInt(parts[0], 10);
    const recMonth = parseInt(parts[1], 10);
    return recYear === targetYear && recMonth === targetMonth;
  });
}

/**
 * Calculates the monthly total weight and count from individual diamond records,
 * separating total production from deposited production
 * @param {Array} records
 * @param {number|string} month (1-12)
 * @param {number|string} year
 * @returns {{ totalWeight: number, totalDiamonds: number, depositedWeight: number, depositedDiamonds: number, records: Array, depositedRecords: Array }}
 */
export function calculateMonthlyTotal(records = [], month, year) {
  const monthRecords = getMonthlyRecords(records, month, year);
  const depositedRecords = monthRecords.filter(r => Boolean(r?.isDeposited));

  return {
    totalWeight: calculateTotalWeight(monthRecords),
    totalDiamonds: monthRecords.length,
    depositedWeight: calculateTotalWeight(depositedRecords),
    depositedDiamonds: depositedRecords.length,
    records: monthRecords,
    depositedRecords
  };
}

/**
 * Calculates Total Amount = Deposited Weight × Price Per Carat
 * @param {number} weight (deposited weight)
 * @param {number} pricePerCarat
 * @returns {number}
 */
export function calculateTotalAmount(weight, pricePerCarat) {
  const w = Number(weight) || 0;
  const p = Number(pricePerCarat) || 0;
  return cleanFloat(w * p, 2);
}

/**
 * Gets records produced today
 * @param {Array} records
 * @returns {Array}
 */
export function getTodayRecords(records = []) {
  const today = getTodayDateString();
  return records.filter(r => r.date === today);
}

/**
 * Calculates lifetime production across all saved monthly summaries
 * Uses depositedWeight when available, falling back to totalWeight for legacy summaries
 * @param {Array} monthlySummaries
 * @returns {number}
 */
export function calculateLifetimeProduction(monthlySummaries = []) {
  if (!Array.isArray(monthlySummaries)) return 0;
  const sum = monthlySummaries.reduce((acc, curr) => {
    const w = curr?.depositedWeight !== undefined ? Number(curr.depositedWeight) : (Number(curr?.totalWeight) || 0);
    return acc + (isNaN(w) ? 0 : w);
  }, 0);
  return cleanFloat(sum);
}

/**
 * Calculates lifetime earnings across all saved monthly summaries
 * @param {Array} monthlySummaries
 * @returns {number}
 */
export function calculateLifetimeEarnings(monthlySummaries = []) {
  if (!Array.isArray(monthlySummaries)) return 0;
  const sum = monthlySummaries.reduce((acc, curr) => acc + (Number(curr?.totalAmount) || 0), 0);
  return cleanFloat(sum, 2);
}

/**
 * Groups records by date string, sorted by date descending (Newest first)
 * @param {Array} records
 * @returns {Array<{ date: string, count: number, totalWeight: number, records: Array }>}
 */
export function groupRecordsByDate(records = []) {
  if (!Array.isArray(records)) return [];
  const groups = {};

  records.forEach(record => {
    const d = record.date || 'Unknown';
    if (!groups[d]) {
      groups[d] = [];
    }
    groups[d].push(record);
  });

  return Object.keys(groups)
    .sort((a, b) => (a < b ? 1 : -1)) // Descending date
    .map(date => ({
      date,
      count: groups[date].length,
      totalWeight: calculateTotalWeight(groups[date]),
      records: groups[date]
    }));
}

/**
 * Groups records by month for chart representation
 * Returns last N months data
 * @param {Array} records
 * @param {number} numMonths
 * @returns {Array<{ key: string, label: string, year: number, month: number, weight: number, count: number }>}
 */
export function getMonthlyProductionTrend(records = [], numMonths = 6) {
  const now = new Date();
  const months = [];

  for (let i = numMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const key = `${year}-${String(month).padStart(2, '0')}`;

    const monthRecords = getMonthlyRecords(records, month, year);
    const weight = calculateTotalWeight(monthRecords);

    months.push({
      key,
      label,
      year,
      month,
      weight,
      count: monthRecords.length
    });
  }

  return months;
}
