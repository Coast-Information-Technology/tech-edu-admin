# Console Management in Production

This document explains how console output is managed in this Next.js application to prevent sensitive information from being exposed in production.

## 🚫 What's Disabled in Production

- `console.log()`
- `console.info()`
- `console.debug()`
- `console.group()`
- `console.groupEnd()`
- `console.table()`
- `console.time()`
- `console.timeEnd()`

## ✅ What's Kept in Production

- `console.error()` - For critical error debugging
- `console.warn()` - For important warnings

## 🔧 Implementation Methods

### 1. Next.js Built-in Console Removal

```javascript
// next.config.js
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error'] // Keep console.error for debugging
  } : false,
}
```

### 2. Custom Console Utility

```typescript
// lib/console.ts
import { safeConsole } from "@/lib/console";

// Use instead of console.log
safeConsole.log("This will only show in development");
```

### 3. Debug Utility

```typescript
// lib/debug.ts
import { debug } from "@/lib/debug";

// Development-only logging
debug.log("API Request:", endpoint);
debug.api.request(endpoint, method, data);
```

### 4. Environment-Aware Logging

```typescript
// lib/env.ts
import { isDevelopment } from "@/lib/env";

if (isDevelopment) {
  console.log("Development only message");
}
```

## 🚀 Usage Examples

### Safe Console Usage

```typescript
import { safeConsole } from "@/lib/console";

// This will be removed in production
safeConsole.log("User data:", userData);
safeConsole.warn("Deprecated API used");
safeConsole.error("Critical error occurred"); // Kept in production
```

### Debug Utility Usage

```typescript
import { debug } from "@/lib/debug";

// API debugging
debug.api.request("/api/users", "GET");
debug.api.response("/api/users", 200, userData);
debug.api.error("/api/users", error);

// General debugging
debug.log("Component mounted");
debug.group("User Profile");
debug.log("Name:", user.name);
debug.log("Email:", user.email);
debug.groupEnd();
```

### Environment Checks

```typescript
import { isDevelopment, shouldLog } from "@/lib/env";

// Simple environment check
if (isDevelopment) {
  console.log("Development mode");
}

// Conditional logging
if (shouldLog("info")) {
  console.info("Information message");
}
```

## 🏗️ Build Process

### Development Build

```bash
npm run dev
# All console statements are active
```

### Production Build

```bash
npm run build:prod
# Console statements are removed (except error/warn)
```

### Production Start

```bash
npm run start:prod
# Runs with console removal active
```

## 🔍 Verification

To verify console removal is working:

1. **Build for production:**

   ```bash
   npm run build:prod
   ```

2. **Check the built files:**

   - Look in `.next/static/chunks/` for JavaScript files
   - Search for `console.log` - should not be found
   - Search for `console.error` - should still be present

3. **Test in browser:**
   - Open browser dev tools
   - Navigate to your production app
   - Check console - should be clean except for errors/warnings

## 🛠️ Customization

### Exclude Additional Console Methods

```javascript
// next.config.js
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn', 'info'] // Keep these methods
  } : false,
}
```

### Custom Webpack Plugin

The project includes a custom webpack plugin (`lib/webpack-console-remover.js`) for additional console removal if needed.

### Environment Variables

```bash
# .env.local
NODE_ENV=production
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false
```

## 📝 Best Practices

1. **Use safeConsole for all logging** instead of direct console calls
2. **Use debug utility for development-only logging**
3. **Keep console.error for critical debugging** in production
4. **Test production builds locally** to verify console removal
5. **Use environment checks** for conditional logging
6. **Avoid logging sensitive data** even in development

## 🚨 Security Considerations

- **Never log sensitive data** (passwords, tokens, personal info)
- **Use console.error sparingly** in production
- **Test production builds** to ensure no sensitive data is logged
- **Consider using a logging service** for production error tracking

## 🔧 Troubleshooting

### Console Still Showing in Production

1. Check `NODE_ENV` is set to `production`
2. Verify Next.js config is correct
3. Clear browser cache and rebuild
4. Check for dynamic console calls (not removed by static analysis)

### Missing Error Logs

1. Ensure `console.error` is in the exclude list
2. Check if errors are being caught and not logged
3. Verify error handling in try-catch blocks

### Build Issues

1. Check webpack plugin configuration
2. Verify all dependencies are installed
3. Check for syntax errors in console removal code
