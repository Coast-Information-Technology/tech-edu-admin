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
} from "@/components/ui/dialog";
import { getApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";

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

  useEffect(() => {
    if (!accessToken) return;
    getApiRequest("/api/users", accessToken)
      .then((res) => {
        const apiUsers = res?.data?.data?.data?.users || [];
        console.log("Response All Users", apiUsers);
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
      .catch(() => setUsers([]));
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

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="text-white hover:text-black">
            <Link href="/dashboard/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
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
          <CardContent className="p-4">
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
          <CardContent className="p-4">
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
          <CardContent className="p-4">
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
          >
            Suspend
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction("Activate")}
          >
            Activate
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleBulkAction("Delete")}
          >
            Delete
          </Button>
        </div>
      )}

      {/* Users Table */}
      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="rounded-[10px]"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>isVerified</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Onboarding Status</TableHead>
                    <TableHead>Token Version</TableHead>
                    <TableHead>Login Attempts</TableHead>
                    <TableHead>isLocked</TableHead>
                    <TableHead>Lock Expires At</TableHead>
                    <TableHead>isPasswordResetPending</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Last Login IP</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {user.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {user.joinDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {user.lastActive}
                        </div>
                      </TableCell>
                      <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                      <TableCell>{user.provider}</TableCell>
                      <TableCell>{user.onboardingStatus}</TableCell>
                      <TableCell>{user.tokenVersion}</TableCell>
                      <TableCell>{user.loginAttempts}</TableCell>
                      <TableCell>{user.isLocked ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {user.lockExpiresAt
                          ? new Date(user.lockExpiresAt).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        {user.isPasswordResetPending ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {user.updatedAt
                          ? new Date(user.updatedAt).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell>{user.lastLoginIP}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/users/${user.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          {/* <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button> */}
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Edit user"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={
                              user.status === "suspended"
                                ? "Activate user"
                                : "Suspend user"
                            }
                            onClick={() => handleToggleSuspend(user)}
                          >
                            {user.status === "suspended" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Ban className="w-4 h-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {sortedUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button asChild>
                <Link href="/dashboard/users/new">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New User
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setViewUser(null)}
              >
                Close
              </Button>
            </DialogClose>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-3">
                <img
                  src={viewUser.avatar}
                  alt={viewUser.name}
                  className="w-14 h-14 rounded-full border"
                />
                <div>
                  <div className="font-semibold text-lg">{viewUser.name}</div>
                  <div className="text-sm text-gray-500">{viewUser.email}</div>
                  <div className="text-xs text-gray-400">{viewUser.role}</div>
                </div>
              </div>
              <div>
                Status: <Badge>{viewUser.status}</Badge>
              </div>
              <div>Location: {viewUser.location}</div>
              <div>Phone: {viewUser.phone}</div>
              <div>Joined: {viewUser.joinDate}</div>
              <div>Last Active: {viewUser.lastActive}</div>
              <div>Courses Enrolled: {viewUser.coursesEnrolled}</div>
              <div>Courses Completed: {viewUser.coursesCompleted}</div>
              <div>Certifications: {viewUser.certifications}</div>
              {viewUser.company && <div>Company: {viewUser.company}</div>}
              {viewUser.institution && (
                <div>Institution: {viewUser.institution}</div>
              )}
              {viewUser.department && (
                <div>Department: {viewUser.department}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
