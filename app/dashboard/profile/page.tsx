"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  User,
  Shield,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  Target,
  Settings,
  Activity,
  EyeOff,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/contexts/RoleContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  getApiRequestWithRefresh,
  updateApiRequest,
  patchApiRequest,
} from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { toast } from "react-toastify";

// Import only the AdminProfile component for all roles
import AdminProfile from "./components/AdminProfile";

// Role icon mapping for the four main roles
const roleIcons: Record<string, React.ComponentType<any>> = {
  admin: Shield,
  moderator: Shield,
  instructor: GraduationCap,
  customerRepresentative: Users,
};

// Role color mapping for the four main roles
const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  moderator: "bg-yellow-100 text-yellow-800",
  instructor: "bg-blue-100 text-blue-800",
  customerRepresentative: "bg-green-100 text-green-800",
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { profile: contextProfile, setProfile } = useProfile();
  const { userRole, getRoleDisplayName, getRoleDescription, isProfileRole } =
    useRole();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await getApiRequestWithRefresh("/api/users/me", token);

      if (response.status === 200) {
        const profileData = response.data.data.data || response.data.data;
        setUserProfile(profileData);
        // Update the context with the profile data
        setProfile(profileData.profile || {});
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: any) => {
    try {
      setLoading(true);
      const token = getTokenFromCookies();
      if (!token) {
        return { success: false, error: "No authentication token found" };
      }

      // Use the direct PATCH /api/users/me endpoint for profile updates
      const response = await patchApiRequest(
        "/api/users/me",
        token,
        updatedData
      );

      if (response.status === 200) {
        // Update the context with the new data
        setProfile({ ...contextProfile, ...updatedData });
        // Refresh the profile data
        await fetchUserProfile();
        toast.success("Profile updated successfully");
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
      return { success: false, error: "Failed to update profile" };
    } finally {
      setLoading(false);
    }
  };

  // Get role from profile data with fallback to context
  const getCurrentRole = (): string => {
    if (userProfile?.role) return userProfile.role;
    if (userProfile?.profile?.role) return userProfile.profile.role;
    if (userProfile?.data?.role) return userProfile.data.role;
    return userRole;
  };

  // Normalize role value
  const normalizeRole = (role: string): string => {
    return role?.toLowerCase()?.replace(/[_-]/g, "");
  };

  // Render profile component for all roles (using AdminProfile for all)
  const renderProfileComponent = () => {
    const currentRole = getCurrentRole();
    const normalizedRole = normalizeRole(currentRole);
    const RoleIcon = roleIcons[currentRole] || User;

    // Check if the role is one of the supported roles
    const supportedRoles = [
      "admin",
      "moderator",
      "instructor",
      "customerrepresentative",
    ];

    if (supportedRoles.includes(normalizedRole)) {
      return (
        <AdminProfile
          userProfile={userProfile}
          onUpdate={handleProfileUpdate}
          userId={userProfile._id || userProfile.id || userProfile.userId || ""}
          token={getTokenFromCookies() || ""}
        />
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unsupported Role
          </h3>
          <p className="text-red-600 mb-2">
            Role: "{currentRole}" (normalized: "{normalizedRole}")
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Supported roles: admin, moderator, instructor,
            customerRepresentative
          </p>
          <Button onClick={fetchUserProfile} className="rounded-[10px]">
            Retry
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load profile
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchUserProfile} className="rounded-[10px]">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Profile Data
            </h3>
            <p className="text-gray-600 mb-4">No profile data available</p>
            <Button onClick={fetchUserProfile} className="rounded-[10px]">
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentRole = getCurrentRole();
  const normalizedRole = normalizeRole(currentRole);
  const RoleIcon = roleIcons[currentRole] || User;
  const roleColor = roleColors[currentRole] || "bg-gray-100 text-gray-800";
  const displayName =
    userProfile.profile?.fullName || userProfile.fullName || "User";
  const email = userProfile.profile?.email || userProfile.email || "";
  const avatarUrl =
    userProfile.profile?.avatarUrl ||
    userProfile.profileImageUrl ||
    "/assets/placeholder-avatar.jpg";
  const isVerified = userProfile.isVerified || false;
  const onboardingStatus = userProfile.onboardingStatus || "not_started";

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#011F72]">Profile</h1>
            <p className="text-gray-600">
              Manage your {getRoleDisplayName(currentRole as any)} profile
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-[10px]">
              <User className="w-4 h-4 mr-2" />
              View Public Profile
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-xl">
                      {displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#011F72]">
                    {displayName}
                  </h2>
                  <p className="text-gray-600">{email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={roleColor}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {getRoleDisplayName(currentRole as any)}
                    </Badge>
                    {isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-purple-100 text-purple-800">
                      {onboardingStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Role Description</p>
                <p className="text-sm font-medium">
                  {getRoleDescription(currentRole as any)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderProfileComponent()}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Profile Management
              </CardTitle>
            </CardHeader>
            <CardContent>{renderProfileComponent()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
