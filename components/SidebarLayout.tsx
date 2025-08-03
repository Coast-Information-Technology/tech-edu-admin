"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "./NotificationBell";
import { UserNav } from "./UserNav";
import { useRole } from "@/contexts/RoleContext";
import { dashboardSidebarConfig } from "./dashboardSidebarConfig";
import Image from "next/image";
import {
  deleteRefreshTokenFromCookies,
  deleteTokenFromCookies,
} from "@/lib/cookies";
import { logoutUser } from "@/lib/apiFetch";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, userData, logout } = useRole();
  const dashboardData = dashboardSidebarConfig[userRole] || {
    displayName: "Dashboard",
    sections: [],
  };

  // Keep sections structure for proper rendering
  const sections = dashboardData.sections;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutUser(); // Your existing helper
      // If logoutUser succeeds, redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Even if logoutUser fails, we should still redirect to login
      // and clear any remaining tokens
      deleteTokenFromCookies();
      deleteRefreshTokenFromCookies();
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col
          transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
        `}
      >
        {/* Close button for mobile */}
        {/* <div className="flex md:hidden justify-end p-2">
          <button
            className="text-gray-500 hover:text-gray-900 text-2xl focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div> */}
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center gap-2">
          <Image
            src="/assets/techedusolution.jpg"
            alt="TechEdu Solution logo"
            width={50}
            height={50}
            className="rounded-[10px]"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TechEdu Solution</span>
            <span className="text-xs text-muted-foreground">
              {dashboardData?.displayName || "Dashboard"}
            </span>
          </div>
        </div>
        {/* Menu */}
        <nav className="flex-1 py-4 max-h-screen overflow-y-auto">
          <div className="space-y-6">
            {sections.map((section: any, sectionIndex: number) => (
              <div key={sectionIndex} className="space-y-2">
                {/* Section Title */}
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                {/* Section Items */}
                <ul className="space-y-1">
                  {section.items.map((item: any) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                            isActive
                              ? "bg-blue-100 text-blue-800 font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
        {/* Footer */}
        <div className="border-t border-border py-4 flex flex-col gap-2 mx-3">
          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 justify-start"
            >
              {/* You can use an icon here if you want */}
              <span>Settings</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userData?.avatar}
                alt={userData?.fullName || "User"}
              />
              <AvatarFallback>
                {userData?.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col truncate">
              <span className="text-sm font-medium truncate">
                {userData?.fullName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {userData?.email}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full flex items-center bg-red-500 hover:bg-red-700 text-white rounded-[10px] gap-2 justify-start"
            onClick={logoutHandler}
          >
            {/* You can use an icon here if you want */}
            Logout
          </Button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md flex h-16 items-center gap-2 px-4 border-b rounded-[10px]">
          {/* Sidebar trigger for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold px-4">
            {dashboardData.displayName}
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <NotificationBell />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 w-full p-6 overflow-auto">
          <div className="w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
