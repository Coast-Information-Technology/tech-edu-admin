"use client";
import React, { createContext, useContext } from "react";
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
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { NotificationBell } from "./NotificationBell";
import { UserNav } from "./UserNav";
import { useState } from "react";
import TeamDashboard from "@/components/Team/TeamDashboard";

// Team context for currentProfile and teams
interface TeamContextType {
  currentProfile: string;
  setCurrentProfile: (id: string) => void;
  teams: { id: string; name: string }[];
  setTeams: React.Dispatch<
    React.SetStateAction<{ id: string; name: string }[]>
  >;
}
const TeamContext = createContext<TeamContextType | undefined>(undefined);
export function useTeamContext() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeamContext must be used within TeamProvider");
  return ctx;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { currentProfile, teams } = useTeamContext();
  return currentProfile === "personal" ? (
    <>{children}</>
  ) : (
    <TeamDashboard team={teams.find((t) => t.id === currentProfile)} />
  );
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userRole, userData, logout } = useRole();

  // Remove Team/Profile Switcher and related logic
  // Remove canHaveTeams, teams, currentProfile, setCurrentProfile, TeamContext, and all dropdown/profile switcher JSX

  // Use userRole directly for new roles
  const dashboardData = dashboardSidebarConfig[userRole] || {
    displayName: "Dashboard",
    sections: [],
  };

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

  const renderSection = (section: any) => (
    <SidebarGroup key={section.title}>
      <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>{section.items.map(renderMenuItem)}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#011F72]">
                <Image
                  src="/assets/techedusolution.jpg"
                  alt="Tech Edu Solution Logo"
                  width={80}
                  height={80}
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
          <SidebarFooter className="border-t border-border py-4 flex flex-col gap-2">
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 justify-start"
              >
                <Settings className="h-4 w-4" />
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
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col w-[10vw] ">
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
              className="w-full flex items-center bg-blue-600 hover:bg-blue-400 text-white hover:text-white rounded-[10px] gap-2 justify-start"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-md flex h-16 items-center gap-2 px-4 border-b rounded-[10px]">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 px-4">
              <h1 className="text-lg font-semibold">
                {dashboardData.displayName}
              </h1>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <NotificationBell />
              <UserNav />
            </div>
          </header>
          <main className="p-6 w-full min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
