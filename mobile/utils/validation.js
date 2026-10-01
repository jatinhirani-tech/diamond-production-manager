/**
 * Validates a diamond record form input
 * @param {Object} data Form state
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateDiamondRecord(data) {
  const errors = {};

  // Weight validation
  if (data.weight === undefined || data.weight === null || String(data.weight).trim() === '') {
    errors.weight = 'Diamond weight is required';
  } else {
    const numWeight = Number(data.weight);
    if (isNaN(numWeight)) {
      errors.weight = 'Weight must be a valid number';
    } else if (numWeight <= 0) {
      errors.weight = 'Weight must be greater than 0 CT';
    }
  }

  // Date validation
  if (!data.date || String(data.date).trim() === '') {
    errors.date = 'Production date is required';
  }

  // Shape validation
  if (!data.shape || String(data.shape).trim() === '') {
    errors.shape = 'Diamond shape is required';
  }

  // Packet ID validation
  const hasId = data.hasPacketId !== undefined ? data.hasPacketId : data.hasUniqueId;
  if (hasId && (!data.packetId || String(data.packetId).trim() === '')) {
    errors.packetId = 'Packet ID is required when Unique ID is selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates monthly price per carat input
 * @param {number|string} price
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePricePerCarat(price) {
  if (price === undefined || price === null || String(price).trim() === '') {
    return { isValid: false, error: 'Price per carat is required' };
  }
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Price must be a valid number' };
  }
  if (numPrice < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }
  return { isValid: true };
}
