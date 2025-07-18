# Dashboard Authentication Guard

## Overview

All dashboard routes (`/dashboard/*`) are now protected by the `AuthGuard` component, ensuring that only authenticated users can access dashboard functionality.

## Implementation

### 1. Dashboard Layout Protection

The main dashboard layout (`app/dashboard/layout.tsx`) wraps all dashboard pages with the `AuthGuard` component:

```tsx
"use client";

import React from "react";
import SidebarLayout from "@/components/SidebarLayout";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <SidebarLayout>{children}</SidebarLayout>
      </div>
    </AuthGuard>
  );
}
```

### 2. How AuthGuard Works

The `AuthGuard` component:

1. **Checks for Authentication Token**: Uses `getTokenFromCookies()` to verify if a valid token exists
2. **Automatic Redirect**: Redirects unauthenticated users to `/login` page
3. **Loading State**: Shows a spinner while checking authentication
4. **Error Handling**: Gracefully handles authentication errors

### 3. Protected Routes

All the following dashboard routes are now protected:

- `/dashboard` - Main dashboard
- `/dashboard/profile` - User profile
- `/dashboard/admin/*` - Admin pages
- `/dashboard/institution/*` - Institution pages
- `/dashboard/recruiter/*` - Recruiter pages
- `/dashboard/student/*` - Student pages
- `/dashboard/tech-professional/*` - Tech professional pages
- `/dashboard/company/*` - Company pages
- `/dashboard/courses/*` - Course management
- `/dashboard/jobs/*` - Job management
- `/dashboard/applications/*` - Application management
- `/dashboard/users/*` - User management
- `/dashboard/settings/*` - Settings pages
- And all other dashboard subdirectories

### 4. Authentication Flow

1. **User Access**: When a user tries to access any `/dashboard/*` route
2. **Token Check**: AuthGuard checks for authentication token in cookies
3. **Validation**: If token exists, user can access the dashboard
4. **Redirect**: If no token, user is redirected to `/login`
5. **Loading**: Shows loading spinner during authentication check

### 5. Benefits

- **Security**: Prevents unauthorized access to dashboard functionality
- **Consistency**: All dashboard routes have the same authentication protection
- **User Experience**: Clear redirect to login when authentication is required
- **Maintainability**: Centralized authentication logic in a reusable component

### 6. Token Management

The authentication system uses:

- **Access Token**: 48-hour expiry, stored in cookies
- **Refresh Token**: 7-day expiry, stored in cookies
- **Automatic Refresh**: Tokens are automatically refreshed when needed

### 7. Error Handling

- **No Token**: Redirects to login page
- **Invalid Token**: Redirects to login page
- **Expired Token**: Attempts to refresh, redirects to login if refresh fails
- **Network Errors**: Shows error message and retry option

## Usage

No additional configuration is needed. The AuthGuard automatically protects all dashboard routes when users access them.

## Testing

To test the authentication protection:

1. **With Valid Token**: Access any dashboard route - should work normally
2. **Without Token**: Access any dashboard route - should redirect to login
3. **Expired Token**: Access dashboard with expired token - should redirect to login

## Troubleshooting

If users are unexpectedly redirected to login:

1. Check if the authentication token exists in cookies
2. Verify token expiration
3. Check browser console for authentication errors
4. Ensure the login page is working correctly
