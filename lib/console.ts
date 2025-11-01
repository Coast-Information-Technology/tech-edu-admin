/**
 * Production-safe console utility
 * Automatically disables console output in production environment
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Create a safe console object
export const safeConsole = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Always show errors, even in production (for debugging)
    console.error(...args);
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  group: (label?: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

// Alternative: Override global console in production
if (isProduction && typeof window !== "undefined") {
  // Only override in browser environment
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.group = () => {};
  console.groupEnd = () => {};
  console.table = () => {};
  console.time = () => {};
  console.timeEnd = () => {};
  // Keep console.error for debugging
}

export default safeConsole;
