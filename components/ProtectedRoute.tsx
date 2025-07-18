"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, isAuthenticated, loading } = useRole();

  console.log("ProtectedRoute ⏳", {
    loading,
    isAuthenticated,
    userRole,
    pathname,
  });

  useEffect(() => {
    if (loading) return; // ⏳ WAIT until RoleContext finishes loading cookies

    console.log("ProtectedRoute 2 ⏳", {
      loading,
      isAuthenticated,
      userRole,
      pathname,
    });

    if (!isAuthenticated) {
      // Not logged in, redirect to login
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Wrong role, redirect to that role's dashboard
      router.replace(`/dashboard/${userRole}`);
    }
  }, [loading, isAuthenticated, userRole, requiredRole, pathname, router]);

  // ⏳ While loading, show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
