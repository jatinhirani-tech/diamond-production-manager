/**
 * Generates a unique collision-resistant ID for diamond records and summaries
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = 'dia_') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}_${randomPart}`;
}
