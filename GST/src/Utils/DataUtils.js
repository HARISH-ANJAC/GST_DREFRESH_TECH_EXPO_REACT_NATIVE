// // DataUtils.js


/**
 * Format currency with Indian Rupee symbol
 * @param {number} amount - Amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0.00";
  }
  
  const formattedAmount = parseFloat(amount).toFixed(decimals);
  return `₹${formattedAmount}`;
};

/**
 * Generate invoice number with prefix and sequential number
 * @param {number} lastInvoiceNumber - Last used invoice number
 * @param {string} prefix - Invoice prefix (default: "INV")
 * @returns {string} Generated invoice number
 */
export const generateInvoiceNumber = (lastInvoiceNumber = 0, prefix = "INV") => {
  const nextNumber = lastInvoiceNumber + 1;
  return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
};

/**
 * Calculate totals from products array
 * @param {Array} products - Array of product objects
 * @param {string} invoiceType - "Inside TN" or "Outside TN"
 * @returns {Object} Totals object
 */
export const calculateTotals = (products, invoiceType = "Inside TN") => {
  let subTotal = 0;
  
  products.forEach((p) => {
    const caseQty = parseFloat(p.caseQty) || 0;
    const price = parseFloat(p.price) || 0;
    subTotal += caseQty * price;
  });

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let grandTotal = 0;

  if (invoiceType === "Inside TN") {
    cgst = subTotal * 0.09;
    sgst = subTotal * 0.09;
    grandTotal = subTotal + cgst + sgst;
  } else {
    // "Outside TN"
    igst = subTotal * 0.18;
    grandTotal = subTotal + igst;
  }

  return { 
    subTotal: parseFloat(subTotal.toFixed(2)),
    cgst: parseFloat(cgst.toFixed(2)),
    sgst: parseFloat(sgst.toFixed(2)),
    igst: parseFloat(igst.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2))
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate GST number format
 * @param {string} gst - GST number to validate
 * @returns {boolean} True if valid GST format
 */
export const validateGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

/**
 * Validate Aadhar number format
 * @param {string} aadhar - Aadhar number to validate
 * @returns {boolean} True if valid Aadhar format
 */
export const validateAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar.replace(/\s/g, ''));
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
  }
  
  return phone;
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  return formatDateForDB(new Date());
};

/**
 * Sanitize string for database (prevent SQL injection)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Generate random ID for temporary use
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substr(2, length);
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// Export all functions as default object for convenience
export default {
  formatCurrency,
  generateInvoiceNumber,
  calculateTotals,
  validateEmail,
  validatePhone,
  validateGST,
  validateAadhar,
  formatPhoneNumber,
  getCurrentDate,
  sanitizeString,
  deepClone,
  isEmptyObject,
  generateId,
  debounce,
  capitalizeWords
};