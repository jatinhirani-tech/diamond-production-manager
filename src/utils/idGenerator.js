/**
 * Generates a collision-resistant unique identifier
 * @param {string} prefix Optional prefix (e.g., 'dia_', 'sum_')
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'dia_') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}${crypto.randomUUID()}`;
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}_${randomPart}`;
}
