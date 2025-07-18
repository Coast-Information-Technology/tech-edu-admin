"use client";

import type { NextPage } from "next";
import { useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";

const Home: NextPage = () => {
  const { isAuthenticated, loading, redirectToRoleDashboard } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      redirectToRoleDashboard();
    }
  }, [isAuthenticated, loading, redirectToRoleDashboard, router]);

  return null;
};

export default Home;
