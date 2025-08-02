"use client";

import React, { useState, useEffect } from "react";
import { getApiRequest, patchApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  Ban,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowUpDown,
  Download,
  Trash2,
  UserCheck,
  UserX,
  Target,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "customerCareRepresentative"
    | "instructor"
    | "admin";
  isVerified: boolean;
  isLocked?: boolean;
  createdAt: string;
  updatedAt?: string;
  profileImageUrl?: string;
  lastLoginAt?: string;
  lastLoginIP?: string;
  lastLoginLocation?: string;
  onboardingStatus?: string;
  provider?: string;
  isPasswordResetPending?: boolean;
  lockExpiresAt?: string | null;
  loginAttempts?: number;
  tokenVersion?: number;
  profile?: {
    phoneNumber?: string;
    currentLocation?: string;
    currentJobTitle?: string;
    industryFocus?: string;
    yearsOfExperience?: number;
    employmentStatus?: string;
    academicLevel?: string;
    currentInstitution?: string;
    fieldOfStudy?: string;
    teamName?: string;
    teamSize?: number;
    company?: {
      name: string;
    };
    [key: string]: any;
  };
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isVerifiedFilter, setIsVerifiedFilter] = useState("all");
  const [isLockedFilter, setIsLockedFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof User>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [limit] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const { accessToken } = useTokenManagement();

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

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Fetch users from API
  const fetchUsers = async (page: number = 1, reset: boolean = false) => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: ((page - 1) * limit).toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (roleFilter && roleFilter !== "all") params.append("role", roleFilter);
      if (isVerifiedFilter && isVerifiedFilter !== "all") {
        params.append(
          "isVerified",
          isVerifiedFilter === "true" ? "true" : "false"
        );
      }
      if (isLockedFilter && isLockedFilter !== "all") {
        params.append("isLocked", isLockedFilter === "true" ? "true" : "false");
      }

      const url = `/api/users/?${params.toString()}`;

      const response = await getApiRequest(url, accessToken);

      if (response.status === 200) {
        const data = response.data;

        // Handle nested data structure: data.data.data.users
        const usersData = data?.data?.data || data?.data || data;
        const users = usersData?.users || [];
        const total = usersData?.total || 0;
        const hasMore = usersData?.hasMore || false;

        if (reset) {
          setUsers(users);
        } else {
          setUsers((prev) => (page === 1 ? users : [...prev, ...users]));
        }
        setTotalUsers(total);
        setHasMore(hasMore);
        setCurrentPage(page);
      } else {
        console.error("API error:", response);
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers(1, true);
  }, [accessToken]);

  // Refresh data when filters change
  useEffect(() => {
    fetchUsers(1, true);
  }, [searchTerm, roleFilter, isVerifiedFilter, isLockedFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select users first");
      return;
    }

    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    if (action === "delete") {
      if (
        !confirm(
          `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`
        )
      ) {
        return;
      }

      try {
        const promises = selectedUsers.map((userId) =>
          fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reason: "Admin requested bulk account deletion",
            }),
          })
        );

        await Promise.all(promises);
        toast.success(`${selectedUsers.length} user(s) deleted successfully`);
        setSelectedUsers([]);
        fetchUsers(currentPage, true); // Refresh the list
      } catch (error: any) {
        console.error("Error in bulk delete:", error);
        toast.error("Failed to delete users");
      }
    }
  };

  // Individual user actions

  const handleDeleteUser = async (user: User) => {
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: "Admin requested account deletion",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`User ${user.fullName} deleted successfully`);
        // Refresh the users list
        fetchUsers(currentPage, true);
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Server-side filtering is handled by the API, so we just sort the returned users
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Calculate stats from current users (server-side filtered results)
  const stats = {
    total: totalUsers || 0,
    verified: (users || []).filter((u) => u.isVerified).length,
    locked: (users || []).filter((u) => u.isLocked === true).length,
    active: (users || []).filter((u) => u.isLocked !== true).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#011F72] lg:text-4xl">
              User Management
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Manage all users, roles, and permissions across the platform
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="outline"
              onClick={() => fetchUsers(1, true)}
              disabled={loading}
              className="w-full sm:w-auto rounded-[10px]"
            >
              <RefreshCcw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto rounded-[10px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
            >
              <Link href="/dashboard/users/new">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-[10px]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-[#011F72]">
                    {stats.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.active.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Current page</p>
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
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.verified.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Current page</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Locked</p>
                  <p className="text-3xl font-bold text-red-600">
                    {stats.locked.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Current page</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Ban className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <div className="flex items-center justify-between lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full rounded-[10px]"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Filters */}
              <div
                className={`grid gap-4 ${
                  showFilters ? "block" : "hidden"
                } lg:grid lg:grid-cols-3 lg:gap-4`}
              >
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-2 border-gray-200">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="individualTechProfessional">
                      Tech Professionals
                    </SelectItem>
                    <SelectItem value="teamTechProfessional">
                      Team Professionals
                    </SelectItem>
                    <SelectItem value="recruiter">Recruiters</SelectItem>
                    <SelectItem value="institution">Institutions</SelectItem>
                    <SelectItem value="customerCareRepresentative">
                      Customer Care
                    </SelectItem>
                    <SelectItem value="instructor">Instructors</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={isVerifiedFilter}
                  onValueChange={setIsVerifiedFilter}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl">
                    <SelectValue placeholder="Filter by verification" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-2 border-gray-200">
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Not Verified</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={isLockedFilter}
                  onValueChange={setIsLockedFilter}
                >
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl border-2 border-gray-200">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="false">Active</SelectItem>
                    <SelectItem value="true">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-lg font-semibold text-blue-800">
                    {selectedUsers.length} user(s) selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction("delete")}
                    className="bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Users Table */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                    <TableHead className="w-12 p-4">
                      <Checkbox
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-2 border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("fullName")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("role")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("isVerified")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Verified
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("isLocked")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Locked
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="p-4 font-semibold text-gray-700">
                      Location
                    </TableHead>
                    <TableHead className="p-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("createdAt")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-blue-600"
                      >
                        Joined
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="p-4 font-semibold text-gray-700">
                      Last Login
                    </TableHead>
                    <TableHead className="p-4 font-semibold text-gray-700">
                      Onboarding
                    </TableHead>
                    <TableHead className="w-24 p-4 font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-700">
                              Loading users...
                            </p>
                            <p className="text-sm text-gray-500">
                              Please wait while we fetch the data
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-100 rounded-full">
                            <Users className="w-12 h-12 text-gray-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-700">
                              No users found
                            </p>
                            <p className="text-sm text-gray-500">
                              Try adjusting your filters or search terms
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-100"
                      >
                        <TableCell className="p-4">
                          <Checkbox
                            checked={selectedUsers.includes(user._id)}
                            onCheckedChange={(checked) =>
                              handleSelectUser(user._id, checked as boolean)
                            }
                            className="border-2 border-gray-300"
                          />
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Image
                                src={
                                  user.profileImageUrl ||
                                  "/assets/placeholder-avatar.jpg"
                                }
                                alt={user.fullName}
                                width={48}
                                height={48}
                                className="rounded-full object-cover border-2 border-gray-200"
                              />
                              {user.isVerified && (
                                <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge
                            className={`${getRoleColor(
                              user.role
                            )} border px-3 py-1`}
                          >
                            {getRoleIcon(user.role)}
                            <span className="ml-2 capitalize font-medium">
                              {user.role}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge
                            className={`${
                              user.isVerified
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            } border px-3 py-1`}
                          >
                            {user.isVerified ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {user.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4">
                          <Badge
                            className={`${
                              user.isLocked
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            } border px-3 py-1`}
                          >
                            {user.isLocked ? (
                              <Ban className="w-3 h-3 mr-1" />
                            ) : (
                              <Shield className="w-3 h-3 mr-1" />
                            )}
                            {user.isLocked ? "Locked" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate max-w-32">
                              {user.profile?.currentLocation || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              {user.lastLoginAt
                                ? new Date(
                                    user.lastLoginAt
                                  ).toLocaleDateString()
                                : "Never"}
                            </div>
                            {user.lastLoginLocation && (
                              <div className="text-xs text-gray-500 truncate max-w-32">
                                {user.lastLoginLocation}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">
                              {user.onboardingStatus
                                ? user.onboardingStatus.replace("_", " ")
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.provider || "local"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-blue-100 hover:text-blue-600"
                              title="View user details"
                            >
                              <Link href={`/dashboard/users/${user._id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete user"
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && sortedUsers.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(currentPage - 1, true)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-[5px]"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(currentPage + 1, false)}
                disabled={!hasMore}
                className="flex items-center gap-2 rounded-[5px]"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
