"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly component to prevent hydration mismatches
 * caused by browser extensions or client-only features
 */
export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR and before hydration, show fallback
  if (!isClient) {
    return <>{fallback}</>;
  }

  // After hydration, show children
  return <>{children}</>;
}
