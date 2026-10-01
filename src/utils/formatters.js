/**
 * Formats a number into Indian Rupee representation (e.g., ₹56,000, ₹1,25,000)
 * @param {number|string} amount
 * @param {boolean} includeSymbol
 * @returns {string}
 */
export function formatCurrency(amount, includeSymbol = true) {
  const num = Number(amount);
  if (isNaN(num)) return includeSymbol ? '₹0' : '0';

  // Format using Indian numbering system
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }).format(num);

  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Formats carat weight cleanly without floating point artifacts
 * @param {number|string} weight
 * @param {boolean} includeUnit
 * @param {number} minDecimals
 * @returns {string}
 */
export function formatCarat(weight, includeUnit = true, minDecimals = 2) {
  const num = Number(weight);
  if (isNaN(num) || num === 0) {
    return includeUnit ? `0.00 CT` : `0.00`;
  }

  // Handle floating point imprecision e.g. 16.199999999999996 -> 16.2
  const rounded = Math.round(num * 10000) / 10000;
  
  // Format with at least minDecimals (default 2), but show up to 4 if precision exists
  const hasMoreThanTwoDecimals = (rounded * 100) % 1 !== 0;
  const decimals = hasMoreThanTwoDecimals ? 3 : minDecimals;

  const formatted = rounded.toFixed(decimals);
  return includeUnit ? `${formatted} CT` : formatted;
}

/**
 * Formats count with Indian locale
 * @param {number} count
 * @returns {string}
 */
export function formatNumber(count) {
  const num = Number(count) || 0;
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Formats an ISO or YYYY-MM-DD date into "03 Oct 2026"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput + (dateInput.length === 10 ? 'T00:00:00' : '')) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formats date into short form: "03 Oct"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatShortDate(dateInput) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput + (dateInput.length === 10 ? 'T00:00:00' : '')) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
}

/**
 * Formats year and month into "October 2026"
 * @param {number|string} year
 * @param {number|string} month (1-12)
 * @returns {string}
 */
export function formatMonthYear(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) return '';

  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Formats year and month into "Oct 2026"
 * @param {number|string} year
 * @param {number|string} month (1-12)
 * @returns {string}
 */
export function formatMonthShort(year, month) {
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) return '';

  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
