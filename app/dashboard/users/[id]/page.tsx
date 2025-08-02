"use client";

import React, { useState, useEffect, use } from "react";
import { getApiRequest, patchApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Users,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Ban,
  GraduationCap,
  Building2,
  Briefcase,
  BookOpen,
  Award,
  Activity,
  TrendingUp,
  Eye,
  Download,
  MessageSquare,
  Settings,
  AlertTriangle,
  UserCheck,
  UserX,
  Target,
  Copy,
  ExternalLink,
  RefreshCw,
  Trash2,
  AlertCircle,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/types/users";
import RecruiterProfile from "./components/RecruiterProfile";
import CustomerCareProfile from "./components/CustomerCareProfile";
import IndividualTechProfessionalProfile from "./components/IndividualTechProfessionalProfile";
import TeamTechProfessionalProfile from "./components/TeamTechProfessionalProfile";
import StudentProfile from "./components/StudentProfile";
import UserEditForm from "./components/UserEditForm";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [updating, setUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { accessToken, isLoading: tokenLoading } = useTokenManagement();

  // Fetch user data
  const fetchUser = async () => {
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);

      const response = await getApiRequest(
        `/api/users/admin/${resolvedParams.id}`,
        accessToken
      );

      if (response.status === 200) {
        // Try different possible data structures
        let userData = null;
        if (response.data?.data) {
          userData = response.data.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          response.data._id
        ) {
          userData = response.data;
        } else if (response.data?.data?.data) {
          userData = response.data.data.data;
        }

        // Ensure we have the user data
        if (userData && typeof userData === "object" && userData._id) {
          setUser(userData);
        } else {
          console.error("Invalid user data structure:", userData);
          toast.error("Invalid user data received");
        }
      } else {
        console.error("API error:", response);
        toast.error(response.message || "Failed to fetch user");
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenLoading && accessToken) {
      fetchUser();
    }
  }, [resolvedParams.id, accessToken, tokenLoading]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "teamTechProfessional":
        return <Users className="w-4 h-4" />;
      case "recruiter":
        return <Target className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      case "customerCareRepresentative":
        return <Users className="w-4 h-4" />;
      case "instructor":
        return <GraduationCap className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "individualTechProfessional":
        return "bg-green-100 text-green-800 border-green-200";
      case "teamTechProfessional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "recruiter":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "institution":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "customerCareRepresentative":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "instructor":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (isLocked?: boolean) => {
    return isLocked
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusLabel = (isLocked?: boolean) => {
    return isLocked ? "Locked" : "Active";
  };

  const getStatusIcon = (isLocked?: boolean) => {
    return isLocked ? (
      <Ban className="w-4 h-4" />
    ) : (
      <CheckCircle className="w-4 h-4" />
    );
  };

  const handleToggleVerify = async () => {
    if (!user || !accessToken) return;

    try {
      setUpdating(true);
      const response = await patchApiRequest(
        `/api/users/${user._id}`,
        accessToken,
        {
          isVerified: !user.isVerified,
        }
      );

      if (response.status === 200) {
        setUser((prev) =>
          prev ? { ...prev, isVerified: !prev.isVerified } : null
        );
        toast.success(
          `User ${user.isVerified ? "unverified" : "verified"} successfully`
        );
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error toggling verification:", error);
      toast.error("Failed to update verification status");
    } finally {
      setUpdating(false);
    }
  };

  // Handle user profile update with restricted fields
  const handleUserUpdate = async (updatedData: {
    email?: string;
    fullName?: string;
    profileImageUrl?: string;
    isVerified?: boolean;
    isLocked?: boolean;
  }) => {
    if (!user || !accessToken) return;

    try {
      setUpdating(true);
      const response = await patchApiRequest(
        `/api/users/${user._id}`,
        accessToken,
        updatedData
      );

      if (response.status === 200) {
        setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
        toast.success("User updated successfully");
      } else {
        console.error("Update failed with status:", response.status);
        console.error("Response data:", response.data);
        toast.error(
          response.data?.message || response.message || "Failed to update user"
        );
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      console.error("Error response:", error.response);
      toast.error(
        error.data?.message || error.message || "Failed to update user"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleLock = async () => {
    if (!user || !accessToken) return;

    try {
      setUpdating(true);
      const response = await patchApiRequest(
        `/api/users/${user._id}`,
        accessToken,
        {
          isLocked: !user.isLocked,
        }
      );

      if (response.status === 200) {
        setUser((prev) =>
          prev ? { ...prev, isLocked: !prev.isLocked } : null
        );
        toast.success(
          `User ${user.isLocked ? "unlocked" : "locked"} successfully`
        );
      } else {
        toast.error(response.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error toggling lock status:", error);
      toast.error("Failed to update lock status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (!user || !accessToken) return;

    if (
      !confirm(
        `Are you sure you want to deactivate ${user.fullName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Admin requested account deactivation",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`User ${user.fullName} deactivated successfully`);
        // Redirect back to users list
        window.location.href = "/dashboard/users";
      } else {
        toast.error(data.message || "Failed to deactivate user");
      }
    } catch (error: any) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user");
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading || tokenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/users">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              {tokenLoading
                ? "Loading authentication..."
                : "Loading user data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/users">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button asChild>
              <Link href="/dashboard/users">Back to Users</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Back to Users Button */}
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={fetchUser}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* User Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-0">
          <div className="bg-gradient-to-r from-[#011F72] to-blue-600 p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative">
                  <Image
                    src={
                      user.profileImageUrl || "/assets/placeholder-avatar.jpg"
                    }
                    alt={user.fullName}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                      user.isVerified ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {user.isVerified ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <Clock className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-blue-100 flex items-center gap-2">
                    {user.email}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(user.email)}
                      className="h-6 w-6 p-0 text-blue-100 hover:bg-white/20"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </Badge>
                    <Badge className={getStatusColor(user.isLocked)}>
                      {getStatusIcon(user.isLocked)}
                      <span className="ml-1">
                        {getStatusLabel(user.isLocked)}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
              {/* <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#011F72]"
                  asChild
                >
                  <Link href={`/dashboard/users/${user._id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#011F72]"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#011F72]"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Account Status
                  </p>
                  <p className="text-2xl font-bold text-[#011F72]">
                    {user.isVerified ? "Verified" : "Pending"}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Login Status
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {user.isLocked ? "Locked" : "Active"}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Member Since
                  </p>
                  <p className="text-lg font-bold text-[#011F72]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Last Login
                  </p>
                  <p className="text-lg font-bold text-[#011F72]">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-2">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="settings">Edit Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Basic Information */}
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                      {user.profile?.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {user.profile.phoneNumber}
                          </span>
                        </div>
                      )}
                      {user.profile?.currentLocation && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {user.profile.currentLocation}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {user.profile?.currentJobTitle && (
                      <div>
                        <h4 className="font-semibold text-[#011F72] mb-2">
                          Current Position
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.profile.currentJobTitle}
                        </p>
                      </div>
                    )}

                    {user.profile?.industryFocus && (
                      <div>
                        <h4 className="font-semibold text-[#011F72] mb-2">
                          Industry Focus
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.profile.industryFocus}
                        </p>
                      </div>
                    )}

                    {user.profile?.major && (
                      <div>
                        <h4 className="font-semibold text-[#011F72] mb-2">
                          Academic Information
                        </h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Major: {user.profile.major}
                          </p>
                          {user.profile.graduationYear && (
                            <p className="text-sm text-gray-600">
                              Graduation Year: {user.profile.graduationYear}
                            </p>
                          )}
                          {user.profile.gpa && (
                            <p className="text-sm text-gray-600">
                              GPA: {user.profile.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Profile Status */}
                    {!user.profile && (
                      <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Profile Not Created
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          This user hasn't completed their profile setup yet.
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Onboarding: {user.onboardingStatus || "Not started"}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Role-Specific Information */}
                {user.role === "recruiter" && (
                  <RecruiterProfile profile={user.profile} />
                )}

                {user.role === "customerCareRepresentative" && (
                  <CustomerCareProfile profile={user.profile} />
                )}

                {user.role === "individualTechProfessional" && (
                  <IndividualTechProfessionalProfile profile={user.profile} />
                )}

                {user.role === "teamTechProfessional" && (
                  <TeamTechProfessionalProfile profile={user.profile} />
                )}

                {user.role === "student" && (
                  <StudentProfile profile={user.profile} />
                )}

                {/* Professional Goals - Only show if profile exists */}
                {(user.profile?.lookingForJobs ||
                  user.profile?.interestedInTraining ||
                  user.profile?.availableAsInstructor ||
                  (user.profile?.platformGoals &&
                    user.profile.platformGoals.length > 0)) && (
                  <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Professional Goals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.profile?.lookingForJobs !== undefined && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Looking for Jobs:{" "}
                              {user.profile.lookingForJobs ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                        {user.profile?.interestedInTraining !== undefined && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Interested in Training:{" "}
                              {user.profile.interestedInTraining ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                        {user.profile?.availableAsInstructor !== undefined && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Available as Instructor:{" "}
                              {user.profile.availableAsInstructor
                                ? "Yes"
                                : "No"}
                            </span>
                          </div>
                        )}
                        {user.profile?.remoteWorkExperience !== undefined && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Remote Work Experience:{" "}
                              {user.profile.remoteWorkExperience ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {user.profile?.platformGoals &&
                        user.profile.platformGoals.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Platform Goals
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.platformGoals.map((goal, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {user.profile?.learningGoals?.priorityAreas &&
                        user.profile.learningGoals.priorityAreas.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Learning Priority Areas
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.learningGoals.priorityAreas.map(
                                (area, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {area}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )}

                {/* Technical Skills */}
                {((user.profile?.programmingLanguages &&
                  user.profile.programmingLanguages.length > 0) ||
                  (user.profile?.frameworksAndTools &&
                    user.profile.frameworksAndTools.length > 0) ||
                  (user.profile?.preferredTechStack &&
                    user.profile.preferredTechStack.length > 0) ||
                  (user.profile?.softSkills &&
                    user.profile.softSkills.length > 0)) && (
                  <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.profile?.programmingLanguages &&
                        user.profile.programmingLanguages.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Programming Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.programmingLanguages.map(
                                (lang, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800"
                                  >
                                    {lang}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {user.profile?.frameworksAndTools &&
                        user.profile.frameworksAndTools.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Frameworks & Tools
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.frameworksAndTools.map(
                                (tool, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-green-100 text-green-800"
                                  >
                                    {tool}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {user.profile?.preferredTechStack &&
                        user.profile.preferredTechStack.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Preferred Tech Stack
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.preferredTechStack.map(
                                (tech, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-purple-100 text-purple-800"
                                  >
                                    {tech}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {user.profile?.softSkills &&
                        user.profile.softSkills.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Soft Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.softSkills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {user.profile?.certifications &&
                        user.profile.certifications.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#011F72] mb-2">
                              Certifications
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {user.profile.certifications.map(
                                (cert, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-800"
                                  >
                                    {cert}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                )}

                {/* Account Details */}
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">User ID</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-800">
                            {user._id}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(user._id)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Provider</span>
                        <span className="text-sm font-medium">
                          {user.provider || "local"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Onboarding Status
                        </span>
                        <span className="text-sm font-medium">
                          {user.onboardingStatus
                            ? user.onboardingStatus.replace("_", " ")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium">
                          {user.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      {user.profile?.onboardingStatus && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Profile Onboarding
                          </span>
                          <span className="text-sm font-medium">
                            {user.profile.onboardingStatus.replace("_", " ")}
                          </span>
                        </div>
                      )}
                      {user.profile?.isActive !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Profile Active
                          </span>
                          <span className="text-sm font-medium">
                            {user.profile.isActive ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                    </div>

                    {user.lastLoginLocation && (
                      <div>
                        <h4 className="font-semibold text-[#011F72] mb-2">
                          Last Login Location
                        </h4>
                        <p className="text-sm text-gray-600">
                          {user.lastLoginLocation}
                        </p>
                        {user.lastLoginIP && (
                          <p className="text-xs text-gray-500 mt-1">
                            IP: {user.lastLoginIP}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Additional Profile Information */}
                    {(user.profile?.trainingAvailability ||
                      user.profile?.skillAssessmentInterested !== undefined ||
                      user.profile?.consentToTerms !== undefined) && (
                      <div>
                        <h4 className="font-semibold text-[#011F72] mb-2">
                          Additional Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {user.profile?.trainingAvailability && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Training Availability:{" "}
                                {user.profile.trainingAvailability}
                              </span>
                            </div>
                          )}
                          {user.profile?.skillAssessmentInterested !==
                            undefined && (
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Skill Assessment:{" "}
                                {user.profile.skillAssessmentInterested
                                  ? "Interested"
                                  : "Not Interested"}
                              </span>
                            </div>
                          )}
                          {user.profile?.consentToTerms !== undefined && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Terms Consent:{" "}
                                {user.profile.consentToTerms
                                  ? "Agreed"
                                  : "Not Agreed"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Project Links */}
                    {user.profile?.additionalProjectLinks &&
                      user.profile.additionalProjectLinks.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-[#011F72] mb-2">
                            Additional Project Links
                          </h4>
                          <div className="space-y-2">
                            {user.profile.additionalProjectLinks.map(
                              (link, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-500" />
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {link}
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-[10px]">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="font-medium text-[#011F72]">
                            Account Created
                          </p>
                          <p className="text-sm text-gray-600">
                            User account was created
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(user.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {user.lastLoginAt && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-[10px]">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="font-medium text-[#011F72]">
                              Last Login
                            </p>
                            <p className="text-sm text-gray-600">
                              User logged in successfully
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(user.lastLoginAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {user.updatedAt && user.updatedAt !== user.createdAt && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-[10px]">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="font-medium text-[#011F72]">
                              Profile Updated
                            </p>
                            <p className="text-sm text-gray-600">
                              User profile was updated
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(user.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Course management interface would go here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* User Profile Edit Form */}
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Edit User Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserEditForm
                      user={user}
                      onUpdate={handleUserUpdate}
                      updating={updating}
                    />
                  </CardContent>
                </Card>

                {/* Account Management */}
                <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Verification Status</p>
                        <p className="text-sm text-gray-600">
                          {user.isVerified
                            ? "User is verified"
                            : "User is not verified"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleToggleVerify}
                          disabled={updating}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          {user.isVerified ? "Unverify" : "Verify"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account Status</p>
                        <p className="text-sm text-gray-600">
                          {user.isLocked
                            ? "Account is locked"
                            : "Account is active"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleToggleLock}
                          disabled={updating}
                        >
                          {user.isLocked ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Unlock
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Lock
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Export</p>
                        <p className="text-sm text-gray-600">
                          Export user data and activity
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {/* <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href={`/dashboard/users/${user._id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Courses
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card> */}

            {/* Account Status */}
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(user.isLocked)}>
                    {getStatusIcon(user.isLocked)}
                    <span className="ml-1">
                      {getStatusLabel(user.isLocked)}
                    </span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Verification</span>
                  <Badge
                    className={
                      user.isVerified
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-yellow-100 text-yellow-800 border-yellow-200"
                    }
                  >
                    {user.isVerified ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    <span className="ml-1">
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1 capitalize">{user.role}</span>
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Active</span>
                  <span className="text-sm font-medium">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleLock}
                  disabled={updating}
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                  {user.isLocked ? "Unlock Account" : "Lock Account"}
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={handleDeactivateUser}
                  disabled={updating}
                >
                  <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                  Deactivate Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
