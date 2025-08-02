"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
} from "lucide-react";

interface AdminProfileProps {
  userProfile: any;
  userId: string;
  token: string;
}

export default function AdminProfile({
  userProfile,
  userId,
  token,
}: AdminProfileProps) {
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No profile data available</p>
        </div>
      </div>
    );
  }

  const profile = userProfile.profile || {};
  const displayName = profile.fullName || userProfile.fullName || "User";
  const email = profile.email || userProfile.email || "";
  const avatarUrl =
    profile.avatarUrl ||
    userProfile.profileImageUrl ||
    "/assets/placeholder-avatar.jpg";
  const isVerified = userProfile.isVerified || false;
  const onboardingStatus = userProfile.onboardingStatus || "not_started";
  const permissions = profile.permissions || [];
  const departments = profile.departments || [];
  const assignedRegions = profile.assignedRegions || [];

  // Get role-specific information
  const getRoleInfo = () => {
    const role = profile.role || userProfile.role || "admin";
    switch (role) {
      case "admin":
        return {
          title: "System Administrator Profile",
          description: "Full system access and user management",
          icon: Shield,
          canEditAll: true,
          canEditProfile: true,
        };
      case "moderator":
        return {
          title: "Moderator Profile",
          description: "Content moderation and user management",
          icon: Shield,
          canEditAll: false,
          canEditProfile: true,
        };
      case "instructor":
        return {
          title: "Instructor Profile",
          description: "Course management and student support",
          icon: User,
          canEditAll: false,
          canEditProfile: true,
        };
      case "customerRepresentative":
        return {
          title: "Customer Representative Profile",
          description: "Customer support and inquiry handling",
          icon: Users,
          canEditAll: false,
          canEditProfile: true,
        };
      default:
        return {
          title: "User Profile",
          description: "Standard user profile",
          icon: User,
          canEditAll: false,
          canEditProfile: true,
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-6">
      {/* Enhanced Profile Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl font-semibold text-[#011F72]">
                {roleInfo.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {roleInfo.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <div className="xl:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {displayName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#011F72]">
                    {displayName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {roleInfo.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                    {isVerified && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      {onboardingStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-[#011F72]">
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Member since</p>
                      <p className="text-sm font-medium truncate">
                        {userProfile.createdAt
                          ? new Date(userProfile.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Last updated</p>
                      <p className="text-sm font-medium truncate">
                        {userProfile.updatedAt
                          ? new Date(userProfile.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Role</p>
                      <Badge className="bg-blue-100 text-blue-800 capitalize text-xs">
                        {profile.role || userProfile.role}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Profile Information */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#011F72]">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Full Name</p>
                      <p className="text-sm font-medium">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-medium">
                        {profile.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Email Address</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Bio</p>
                    <p className="text-sm">
                      {profile.bio || "No bio provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Role-based Access Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold text-[#011F72]">
                    Access Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">
                        Profile Edit Access
                      </p>
                      <Badge
                        className={`text-xs ${
                          roleInfo.canEditProfile
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {roleInfo.canEditProfile ? "Allowed" : "Restricted"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">User Management</p>
                      <Badge
                        className={`text-xs ${
                          roleInfo.canEditAll
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {roleInfo.canEditAll ? "Full Access" : "Limited Access"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              {permissions.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#011F72]">
                      System Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {permissions.map((permission: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm truncate">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Departments */}
              {departments.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#011F72]">
                      Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-[10px] text-xs"
                        >
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Assigned Regions */}
              {assignedRegions.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-[#011F72]">
                      Assigned Regions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {assignedRegions.map((region: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="rounded-[10px] text-xs"
                        >
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
