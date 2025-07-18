"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { dashboardSidebarConfig } from "@/components/dashboardSidebarConfig";
import { LogOut, Settings, Bell } from "lucide-react";
import Image from "next/image";

export default function DashboardPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userRole, userData, logout } = useRole();

  const sidebarRoleMap: Record<
    string,
    "student" | "admin" | "techProfessional" | "recruiter" | "institution"
  > = {
    graduate: "student",
    student: "student",
    admin: "admin",
    techprofessional: "techProfessional",
    recruiter: "recruiter",
    institution: "institution",
  };
  const sidebarRole =
    sidebarRoleMap[(userRole || "").toLowerCase()] || "student";
  const dashboardData = dashboardSidebarConfig[sidebarRole];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: any) => {
    const isActive = isActiveRoute(item.href);
    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
          <Link href={item.href}>
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderSection = (section: any) => {
    return (
      <SidebarGroup key={section.title}>
        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{section.items.map(renderMenuItem)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#011F72]">
                {/* <span className="text-sm font-semibold text-white">TE</span> */}
                <Image
                  src="/assets/techedusolution.jpg"
                  alt="Tech Edu Solution Logo"
                  width={60}
                  height={60}
                  className="rounded-[5px]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">TechEdu Solution</span>
                <span className="text-xs text-muted-foreground">
                  {dashboardData.displayName}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {dashboardData.sections.map(renderSection)}
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userData?.avatar}
                alt={userData?.name || "User"}
              />
              <AvatarFallback>
                {userData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate">
                  {userData?.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {userData?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md flex h-16 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 px-4">
              <h1 className="text-lg font-semibold">
                {dashboardData.displayName}
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </header>
          <main className="flex-1 w-full bg-gradient-to-br from-blue-50/60 via-white/80 to-gray-100/80 p-4 min-h-[calc(100vh-4rem)] shadow-lg">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
