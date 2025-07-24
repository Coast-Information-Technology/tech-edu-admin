"use client";

import React, { useState, useEffect } from "react";
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
  Check,
  X,
  Lock,
  Unlock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "institution"
    | "admin"
    | string; // add string for custom roles like "instructor", "recruiter", etc.
  status: "active" | "inactive" | "pending" | "suspended";
  avatar: string;
  location: string;
  phone: string;
  joinDate: string;
  lastActive: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certifications: number;
  department?: string;
  company?: string;
  institution?: string;

  // Add these properties:
  isVerified?: boolean;
  provider?: string;
  onboardingStatus?: string;
  tokenVersion?: number;
  loginAttempts?: number;
  isLocked?: boolean;
  lockExpiresAt?: string | null;
  isPasswordResetPending?: boolean;
  updatedAt?: string;
  lastLoginIP?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { accessToken } = useTokenManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getApiRequest("/api/users/admin/", accessToken)
      .then((res) => {
        const apiUsers = res?.data?.data?.users || [];
        setUsers(
          apiUsers.map((u: any) => ({
            id: u._id,
            name: u.fullName,
            email: u.email,
            role: u.role,
            status: u.isLocked ? "suspended" : "active",
            avatar: u.profileImageUrl || "/assets/placeholder-avatar.jpg",
            location: u.lastLoginLocation || "",
            phone: u.phone || "",
            joinDate: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString()
              : "",
            lastActive: u.lastLoginAt
              ? new Date(u.lastLoginAt).toLocaleDateString()
              : "",
            coursesEnrolled: u.coursesEnrolled || 0,
            coursesCompleted: u.coursesCompleted || 0,
            certifications: u.certifications || 0,
            department: u.department || "",
            company: u.company || "",
            institution: u.institution || "",
            // Add these:
            isVerified: u.isVerified,
            provider: u.provider,
            onboardingStatus: u.onboardingStatus,
            tokenVersion: u.tokenVersion,
            loginAttempts: u.loginAttempts,
            isLocked: u.isLocked,
            lockExpiresAt: u.lockExpiresAt,
            isPasswordResetPending: u.isPasswordResetPending,
            updatedAt: u.updatedAt,
            lastLoginIP: u.lastLoginIP,
          }))
        );
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "individualTechProfessional":
        return <Briefcase className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      case "institution":
        return <Building2 className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "individualTechProfessional":
        return "bg-green-100 text-green-800";
      case "company":
        return "bg-purple-100 text-purple-800";
      case "institution":
        return "bg-orange-100 text-orange-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Bulk actions handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };
  const handleBulkAction = (action: string) => {
    // For now, just clear selection and show a toast
    setSelectedUsers([]);
    toast.info(`${action} applied to selected users.`);
  };

  // User action handlers
  const handleViewUser = (user: User) => {
    setViewUser(user);
  };
  const handleEditUser = (user: User) => {
    toast.info(`Edit user: ${user.name}`);
  };
  const handleToggleSuspend = (user: User) => {
    toast.info(
      user.status === "suspended"
        ? `Activate user: ${user.name}`
        : `Suspend user: ${user.name}`
    );
  };

  // Delete user handlers
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete || !accessToken) return;

    try {
      setDeletingUser(true);

      const response = await deleteApiRequest(
        `/api/users/${userToDelete.id}`,
        accessToken
      );

      if (response.status === 200) {
        // Remove user from local state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userToDelete.id)
        );

        toast.success(
          `User ${userToDelete.name} has been deactivated successfully`
        );

        // Show the response reason if available
        if (response.data?.reason) {
          toast.info(`Reason: ${response.data.reason}`);
        }
      } else {
        toast.error(response.message || "Failed to deactivate user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(
        error.message || "An error occurred while deactivating the user"
      );
    } finally {
      setDeletingUser(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  // Pagination logic
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            asChild
            className="text-white hover:text-black rounded-[10px]"
          >
            <Link href="/dashboard/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 border border-blue-200 bg-blue-50 rounded-[10px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border border-green-200 bg-green-50 rounded-[10px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border border-yellow-200 bg-yellow-50 rounded-[10px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 border border-red-200 bg-red-50 rounded-[10px]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-[#011F72]">
                  {stats.suspended}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-[10px]"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-48 rounded-[10px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="individualTechProfessional">
                  Professionals
                </SelectItem>
                <SelectItem value="company">Companies</SelectItem>
                <SelectItem value="institution">Institutions</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 rounded-[10px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[10px]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 mb-2 bg-blue-50 border border-blue-200 rounded px-3 py-2">
          <span className="font-medium text-blue-700">
            {selectedUsers.length} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("Suspend")}
            className="rounded-[5px] bg-amber-600 text-white"
          >
            Suspend
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("Activate")}
            className="rounded-[5px] bg-green-600 text-white"
          >
            Activate
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleBulkAction("Delete")}
            className="rounded-[5px] bg-red-600 text-white hover:text-black"
          >
            Delete
          </Button>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto border rounded-[10px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-12">
                <Checkbox
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  className="rounded-[5px]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Onboarding Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Join Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Verified
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Provider
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Token Version
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Login Attempts
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acc Locked
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lock Expires At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Password Reset Pending
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Updated At
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Login IP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={18} className="text-center py-8">
                  Loading users...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={18} className="text-center py-8">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id, checked as boolean)
                      }
                      className="rounded-[5px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-[#011F72]">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full w-fit mt-1">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {/* onboardingStatus badge */}
                    {user.onboardingStatus === "in_progress" && (
                      <span className="bg-yellow-100 text-yellow-800 rounded-[4px] px-2 py-1 text-xs font-medium">
                        In Progress
                      </span>
                    )}
                    {user.onboardingStatus === "completed" && (
                      <span className="bg-green-100 text-green-800 rounded-[4px] px-2 py-1 text-xs font-medium">
                        Completed
                      </span>
                    )}
                    {user.onboardingStatus === "submitted" && (
                      <span className="bg-blue-100 text-blue-800 rounded-[4px] px-2 py-1 text-xs font-medium">
                        Submitted
                      </span>
                    )}
                    {!["in_progress", "completed", "submitted"].includes(
                      user.onboardingStatus || ""
                    ) && (
                      <span className="bg-gray-100 text-gray-800 rounded-[4px] px-2 py-1 text-xs font-medium">
                        {user.onboardingStatus || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {user.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">{user.joinDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600">
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {/* isVerified icon */}
                    {user.isVerified ? (
                      <Check className="text-green-600 w-5 h-5 mx-auto" />
                    ) : (
                      <X className="text-red-500 w-5 h-5 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">{user.provider}</td>
                  <td className="px-4 py-3">{user.tokenVersion}</td>
                  <td className="px-4 py-3">{user.loginAttempts}</td>
                  <td className="px-4 py-3 text-center">
                    {/* isLocked icon */}
                    {user.isLocked ? (
                      <Lock className="text-red-500 w-5 h-5 mx-auto" />
                    ) : (
                      <Unlock className="text-green-600 w-5 h-5 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.lockExpiresAt
                      ? new Date(user.lockExpiresAt).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-3">
                    {user.isPasswordResetPending ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-3">{user.lastLoginIP}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                          aria-label="Open actions menu"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white rounded-[5px]"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user)}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleSuspend(user)}
                          className="cursor-pointer"
                        >
                          {user.status === "suspended" ? (
                            <UserCheck className="w-4 h-4 mr-1 text-green-600" />
                          ) : (
                            <UserX className="w-4 h-4 mr-1 text-red-600" />
                          )}
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="cursor-pointer text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Bar */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {Math.min((page - 1) * itemsPerPage + 1, sortedUsers.length)}{" "}
          to {Math.min(page * itemsPerPage, sortedUsers.length)} of{" "}
          {sortedUsers.length} users
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-[10px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Deactivate User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to deactivate the account for{" "}
              <span className="font-semibold text-[#011F72]">
                {userToDelete?.name}
              </span>
              ? This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Deactivate the user's account immediately</li>
                <li>Prevent the user from logging in</li>
                <li>Preserve all user data for potential reactivation</li>
                <li>
                  Send a notification to the user about account deactivation
                </li>
              </ul>
              <p className="mt-3 text-sm text-gray-500">
                <strong>Note:</strong> This action can be reversed by an
                administrator if needed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-[10px]"
              disabled={deletingUser}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white rounded-[10px]"
              disabled={deletingUser}
            >
              {deletingUser ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deactivate User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
