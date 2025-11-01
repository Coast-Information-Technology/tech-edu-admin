/**
 * Environment utilities
 * Centralized environment checking and configuration
 */

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

// Environment-specific configurations
export const config = {
  // Console settings
  console: {
    enabled: isDevelopment,
    showWarnings: isDevelopment,
    showErrors: true, // Always show errors
    showInfo: isDevelopment,
    showDebug: isDevelopment,
  },

  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    timeout: isProduction ? 10000 : 30000,
    retries: isProduction ? 3 : 1,
  },

  // Performance settings
  performance: {
    enableMetrics: isDevelopment,
    enableProfiling: isDevelopment,
    enableTiming: isDevelopment,
  },

  // Security settings
  security: {
    enableCSP: isProduction,
    enableHSTS: isProduction,
    enableXSSProtection: isProduction,
  },
};

// Helper functions
export const shouldLog = (level: "log" | "warn" | "info" | "debug") => {
  const consoleConfig = config.console as any;
  return config.console.enabled && consoleConfig[level];
};

export const getApiBaseUrl = () => {
  return config.api.baseUrl;
};

export const isConsoleEnabled = () => {
  return config.console.enabled;
};

export default config;
