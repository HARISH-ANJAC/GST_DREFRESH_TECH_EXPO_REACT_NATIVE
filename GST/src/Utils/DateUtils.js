// DataUtils.js

/**
 * Format date string to DD-MMM-YYYY format
 * Handles various date formats and string values
 * @param {string|Date|number} date - Date string, Date object, or timestamp
 * @returns {string} Formatted date string in "DD-MMM-YYYY" format
 */
export const formatDate = (date) => {
  if (!date) return ""; // Handle empty values gracefully
  
  let parsedDate;

  // Handle different input types
  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === 'number') {
    parsedDate = new Date(date); // Timestamp
  } else if (typeof date === 'string') {
    // Try different date string formats
    parsedDate = parseDateString(date);
  } else {
    console.error("Unsupported date format:", date);
    return "";
  }

  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date:", date);
    return "";
  }

  // Format the date to DD-MMM-YYYY
  const month = parsedDate.toLocaleString("en-US", { month: "short" });
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Parse various date string formats
 * @param {string} dateString - Date string in various formats
 * @returns {Date} Parsed Date object
 */
const parseDateString = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return new Date(NaN);
  }

  const cleanedString = dateString.trim();
  
  // Try ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(cleanedString)) {
    return new Date(cleanedString);
  }
  
  // Try DD/MM/YYYY or MM/DD/YYYY
  if (cleanedString.includes('/')) {
    const parts = cleanedString.split('/');
    if (parts.length === 3) {
      // Try DD/MM/YYYY first (common in India/Europe)
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      if (day > 0 && day <= 31 && month >= 0 && month <= 11) {
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
      }
      
      // Try MM/DD/YYYY (US format)
      const usDate = new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
      if (!isNaN(usDate.getTime())) return usDate;
    }
  }
  
  // Try DD-MM-YYYY
  if (cleanedString.includes('-')) {
    const parts = cleanedString.split('-');
    if (parts.length === 3) {
      // Try DD-MM-YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      if (day > 0 && day <= 31 && month >= 0 && month <= 11) {
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
      }
      
      // Try YYYY-MM-DD (ISO)
      const isoDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (!isNaN(isoDate.getTime())) return isoDate;
    }
  }
  
  // Try textual month formats
  const textualFormats = [
    // DD MMM YYYY
    /(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/,
    // MMM DD, YYYY
    /([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/,
    // YYYY MMM DD
    /(\d{4})\s+([a-zA-Z]+)\s+(\d{1,2})/
  ];
  
  for (const regex of textualFormats) {
    const match = cleanedString.match(regex);
    if (match) {
      const date = new Date(cleanedString);
      if (!isNaN(date.getTime())) return date;
    }
  }
  
  // Try Unix timestamp (string containing only numbers)
  if (/^\d+$/.test(cleanedString)) {
    const timestamp = parseInt(cleanedString, 10);
    // Check if it's in seconds (common) or milliseconds
    if (cleanedString.length <= 10) {
      return new Date(timestamp * 1000); // Convert seconds to milliseconds
    } else {
      return new Date(timestamp); // Assume milliseconds
    }
  }
  
  // Final attempt - let JavaScript's Date constructor handle it
  return new Date(cleanedString);
};

/**
 * Additional date formatting options
 */

/**
 * Format date to different string formats
 * @param {string|Date} date - Input date
 * @param {string} format - Output format
 * @returns {string} Formatted date
 */
export const formatDateCustom = (date, format = 'DD-MMM-YYYY') => {
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const monthShort = parsedDate.toLocaleString("en-US", { month: "short" });
  const monthLong = parsedDate.toLocaleString("en-US", { month: "long" });
  const year = parsedDate.getFullYear();
  const yearShort = String(parsedDate.getFullYear()).slice(-2);

  const formats = {
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'DD/MM/YYYY': `${day}/${month}/${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD-MMM-YYYY': `${day}-${monthShort}-${year}`,
    'MMM DD, YYYY': `${monthShort} ${day}, ${year}`,
    'MMMM DD, YYYY': `${monthLong} ${day}, ${year}`,
    'DD/MM/YY': `${day}/${month}/${yearShort}`,
  };

  return formats[format] || formats['DD-MMM-YYYY'];
};

/**
 * Check if a string is a valid date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Get relative time (e.g., "2 days ago", "1 week ago")
 * @param {string|Date} date - Input date
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const parsedDate = new Date(date);
  
  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInMs = now - parsedDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return "Today";
  }
};

// Export all functions
export default {
  formatDate,
  formatDateCustom,
  parseDateString,
  isValidDate,
  getRelativeTime,
  // ... other existing functions from previous implementation
};