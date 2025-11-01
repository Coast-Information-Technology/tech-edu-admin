/**
 * Development-only debug utility
 * Automatically disabled in production builds
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const debug = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log("[DEBUG]", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn("[DEBUG]", ...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error("[DEBUG]", ...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info("[DEBUG]", ...args);
    }
  },
  group: (label: string) => {
    if (isDevelopment) {
      console.group(`[DEBUG] ${label}`);
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
      console.time(`[DEBUG] ${label}`);
    }
  },
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(`[DEBUG] ${label}`);
    }
  },
  // API-specific debug helpers
  api: {
    request: (endpoint: string, method: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[API REQUEST] ${method} ${endpoint}`, data);
      }
    },
    response: (endpoint: string, status: number, data?: any) => {
      if (isDevelopment) {
        console.log(`[API RESPONSE] ${endpoint} (${status})`, data);
      }
    },
    error: (endpoint: string, error: any) => {
      if (isDevelopment) {
        console.error(`[API ERROR] ${endpoint}`, error);
      }
    },
  },
};

export default debug;
