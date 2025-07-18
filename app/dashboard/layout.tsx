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
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white overflow-hidden">
        <SidebarLayout>{children}</SidebarLayout>
      </div>
    </AuthGuard>
  );
}
