// contexts/RoleContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getTokenFromCookies,
  saveTokenToCookies,
  deleteTokenFromCookies,
  clearAllCookies,
  saveTokensToCookies,
} from "@/lib/cookies";
import { loginUser, logoutUser } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";

// Simplified UserRole type with only the four main roles
export type UserRole =
  | "admin"
  | "moderator"
  | "instructor"
  | "customerRepresentative";

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userData: {
    fullName: string;
    email: string;
    avatar?: string;
    role?: UserRole;
    _id?: string;
    isVerified?: boolean;
    onboardingStatus?: string;
  };
  setUserData: (data: any) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginWithOAuth: (userData: any) => void;
  logout: () => void;
  redirectToRoleDashboard: (role?: UserRole) => void;
  loading: boolean;
  refreshAuth: () => Promise<boolean>;
  getRoleDisplayName: (role: UserRole) => string;
  getRoleDescription: (role: UserRole) => string;
  isProfileRole: (role: UserRole) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Simplified role configuration
const roleConfig: Record<
  UserRole,
  { displayName: string; description: string; isProfileRole: boolean }
> = {
  admin: {
    displayName: "System Administrator",
    description: "Full system access and user management",
    isProfileRole: true,
  },
  moderator: {
    displayName: "Moderator",
    description: "Content moderation and user management",
    isProfileRole: true,
  },
  instructor: {
    displayName: "Instructor",
    description: "Course management and student support",
    isProfileRole: true,
  },
  customerRepresentative: {
    displayName: "Customer Representative",
    description: "Customer support and inquiry handling",
    isProfileRole: true,
  },
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    avatar: "",
    role: "admin" as UserRole,
    _id: "",
    isVerified: false,
    onboardingStatus: "not_started",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user data from cookies on mount
  useEffect(() => {
    const checkAuthCookies = () => {
      const cookies = document.cookie.split(";");
      const authToken = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
      );
      const userDataCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userData=")
      );

      if (authToken && userDataCookie) {
        try {
          const userDataValue = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(userDataValue));

          // Set user data from cookies
          setUserData(userData);
          setUserRole(userData.role || "admin");
          setIsAuthenticated(true);
          setLoading(false);
          return true;
        } catch (error) {
          console.error("Error parsing user data from cookies:", error);
        }
      }
      setLoading(false);
      return false;
    };

    // Check for authentication cookies
    checkAuthCookies();
  }, []);

  const dashboardRoutes: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    moderator: "/dashboard/moderator",
    instructor: "/dashboard/instructor",
    customerRepresentative: "/dashboard/customer-representative",
  };

  const redirectToRoleDashboard = (role?: UserRole) => {
    const targetRole = role || userRole;
    const targetRoute = dashboardRoutes[targetRole] || "/dashboard/admin";
    window.location.href = targetRoute;

    console.debug("[Redirect] Role received:", role);
    console.debug("[Redirect] Role used for routing:", targetRole);

    if (!dashboardRoutes[targetRole]) {
      console.warn(
        `[Redirect] No route found for role: "${targetRole}". Defaulting to /dashboard/admin`
      );
    }
  };

  const loginWithOAuth = (userData: any) => {
    const role = userData.role || "admin";
    setUserRole(role);
    setUserData(userData);
    setIsAuthenticated(true);

    // Save to cookies
    const token = "oauth-token-" + Date.now();
    saveTokenToCookies(token);
    document.cookie = `userData=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${
      process.env.NODE_ENV === "production"
    }; samesite=lax`;

    // Redirect to appropriate dashboard
    redirectToRoleDashboard(role);
  };

  // Refresh authentication state
  const refreshAuth = async (): Promise<boolean> => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      // Check if token is still valid
      const cookies = document.cookie.split(";");
      const userDataCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userData=")
      );

      if (userDataCookie) {
        try {
          const userDataValue = userDataCookie.split("=")[1];
          const userData = JSON.parse(decodeURIComponent(userDataValue));

          setUserData(userData);
          setUserRole(userData.role || "admin");
          setIsAuthenticated(true);
          return true;
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Error refreshing auth:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API endpoint using the apiFetch function
      const response = await logoutUser();

      if (response.status >= 400) {
        console.error("Logout API call failed");
      }
    } catch (error) {
      console.error("Error calling logout API:", error);
    } finally {
      // Clear local state regardless of API call result
      setUserRole("admin");
      setUserData({
        fullName: "",
        email: "",
        avatar: "",
        role: "admin",
        _id: "",
        isVerified: false,
        onboardingStatus: "not_started",
      });
      setIsAuthenticated(false);

      // Clear ALL cookies using the new comprehensive function
      clearAllCookies();

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  // Helper functions for role information
  const getRoleDisplayName = (role: UserRole): string => {
    return roleConfig[role]?.displayName || role;
  };

  const getRoleDescription = (role: UserRole): string => {
    return roleConfig[role]?.description || "User role";
  };

  const isProfileRole = (role: UserRole): boolean => {
    return roleConfig[role]?.isProfileRole || false;
  };

  const value = {
    userRole,
    setUserRole,
    userData,
    setUserData,
    isAuthenticated,
    setIsAuthenticated,
    loginWithOAuth,
    logout,
    redirectToRoleDashboard,
    loading,
    refreshAuth,
    getRoleDisplayName,
    getRoleDescription,
    isProfileRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
