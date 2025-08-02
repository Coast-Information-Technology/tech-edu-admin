"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest, postApiRequestWithRefresh } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Eye,
  Mail,
  Trash,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function OnboardingStuckUsersPage() {
  const [onboardingStuckUsers, setOnboardingStuckUsers] = useState<any[]>([]);
  const [onboardingAnalytics, setOnboardingAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Calculate total pages
  const totalPages = Math.ceil(onboardingStuckUsers.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }
      try {
        // Fetch onboarding analytics
        const analyticsResponse = await getApiRequest(
          "/api/onboarding/analytics",
          token
        );
        if (analyticsResponse.status === 200) {
          const analyticsData =
            analyticsResponse.data?.data || analyticsResponse.data;
          setOnboardingAnalytics(analyticsData);
        }

        // Fetch stuck users
        const stuckUsersResponse = await getApiRequest(
          "/api/onboarding/stuck-users",
          token
        );
        if (stuckUsersResponse.status === 200) {
          console.log("Raw stuck users response:", stuckUsersResponse);
          console.log("Response data:", stuckUsersResponse.data);
          console.log("Response data.data:", stuckUsersResponse.data?.data);

          // Handle the array response directly
          const stuckUsers =
            stuckUsersResponse.data?.data || stuckUsersResponse.data || [];

          console.log("Extracted stuck users array:", stuckUsers);
          console.log("First user object:", stuckUsers[0]);
          console.log(
            "First user keys:",
            stuckUsers[0] ? Object.keys(stuckUsers[0]) : "No users"
          );

          // Filter out null/undefined values and ensure each item has required properties
          const validStuckUsers = Array.isArray(stuckUsers)
            ? stuckUsers
                .filter((user) => {
                  console.log("Checking user:", user);
                  console.log("User userId:", user?.userId);
                  console.log("User _id:", user?._id);
                  return user && (user.userId || user._id) && user.fullName;
                })
                .map((user) => ({
                  // Normalize to use userId consistently
                  userId: user.userId || user._id,
                  fullName: user.fullName,
                  email: user.email,
                  userType: user.userType,
                  currentStep: user.currentStep,
                  lastActivityAt: user.lastActivityAt,
                  hoursSinceLastActivity: user.hoursSinceLastActivity,
                }))
            : [];

          console.log("Valid stuck users:", validStuckUsers);
          setOnboardingStuckUsers(validStuckUsers);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const paginatedOnboardingStuckUsers = onboardingStuckUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      const allUserIds = paginatedOnboardingStuckUsers.map(
        (user) => user.userId
      );
      setSelectedUsers(allUserIds);
      setSelectAll(true);
    }
  };

  // Handle individual user selection
  const handleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedUsers, userId];
      setSelectedUsers(newSelected);
      // Check if all users on current page are selected
      if (newSelected.length === paginatedOnboardingStuckUsers.length) {
        setSelectAll(true);
      }
    }
  };

  // Send reminders
  const sendReminders = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to send reminders to");
      return;
    }

    setReminderLoading(true);
    const token = getTokenFromCookies();
    if (!token) {
      toast.error("Authentication required");
      setReminderLoading(false);
      return;
    }

    try {
      const response = await postApiRequestWithRefresh(
        "/api/onboarding/schedule-reminders",
        {
          emails: selectedUsers
            .map((userId) => {
              const user = onboardingStuckUsers.find(
                (u) => u.userId === userId
              );
              return user?.email;
            })
            .filter(Boolean),
        },
        token
      );

      if (response.status === 200) {
        toast.success(
          `Reminders sent successfully to ${
            response.data?.remindersSent || selectedUsers.length
          } users`
        );
        setReminderDialogOpen(false);
        setSelectedUsers([]);
        setSelectAll(false);
      } else {
        toast.error("Failed to send reminders");
      }
    } catch (err: any) {
      console.error("Error sending reminders:", err);
      toast.error(err.message || "Failed to send reminders");
    } finally {
      setReminderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Onboarding Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and remind Onboarding Stuck Users efficiently
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setReminderDialogOpen(true)}
                disabled={selectedUsers.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 py-3"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Reminders ({selectedUsers.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {onboardingAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {onboardingAnalytics.totalUsers?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">In onboarding</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-[10px]">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Users */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {onboardingAnalytics.completedUsers?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Successfully onboarded
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-[10px]">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Badge className="bg-green-100 text-green-800">
                    {onboardingAnalytics.completionRate?.toFixed(1) || 0}%
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">
                    completion rate
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* In Progress Users */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {onboardingAnalytics.inProgressUsers?.toLocaleString() ||
                        "0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Currently active
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-[10px]">
                    <TrendingUp size={24} className="text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stuck Users */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Stuck Users
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {onboardingAnalytics.stuckUsers?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Need attention</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-[10px]">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stuck Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading stuck users...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-6 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Current Step
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {paginatedOnboardingStuckUsers.length > 0 ? (
                    paginatedOnboardingStuckUsers.map((stuckUser, index) => {
                      // Safety check to ensure user object exists and has required properties
                      if (
                        !stuckUser ||
                        !stuckUser.userId ||
                        !stuckUser.fullName
                      ) {
                        return null; // Skip rendering this row
                      }

                      return (
                        <tr
                          key={stuckUser.userId || index}
                          className="hover:bg-blue-50/50 transition-all duration-300 group"
                        >
                          <td className="px-8 py-6 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(stuckUser.userId)}
                              onChange={() =>
                                handleUserSelection(stuckUser.userId)
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                              {stuckUser.fullName || "Unknown"}
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                              {stuckUser.email || "No email"}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-slate-700">
                              {stuckUser.userType || "Unknown"}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-slate-700">
                              Step {stuckUser.currentStep || "Unknown"}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                              {stuckUser.hoursSinceLastActivity || 0}h
                            </span>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-slate-700">
                              {stuckUser.lastActivityAt
                                ? new Date(
                                    stuckUser.lastActivityAt
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="p-3 rounded-full hover:bg-slate-100 focus:outline-none transition-all duration-300 group-hover:bg-blue-100"
                                  aria-label="Open actions menu"
                                >
                                  <MoreVertical className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200 p-2"
                              >
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/users/${stuckUser.userId}`}
                                    className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-xl transition-all duration-300"
                                  >
                                    <Eye className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">
                                      View User
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      !selectedUsers.includes(stuckUser.userId)
                                    ) {
                                      handleUserSelection(stuckUser.userId);
                                    }
                                    setReminderDialogOpen(true);
                                  }}
                                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-xl transition-all duration-300 text-green-600 cursor-pointer"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span className="font-medium">
                                    Send Reminder
                                  </span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              No stuck users found
                            </h3>
                            <p className="text-slate-600">
                              All users have completed their onboarding process
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(
                  (page - 1) * itemsPerPage + 1,
                  onboardingStuckUsers.length
                )}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900">
                {Math.min(page * itemsPerPage, onboardingStuckUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {onboardingStuckUsers.length}
              </span>{" "}
              stuck users
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || onboardingStuckUsers.length === 0}
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={
                  page === totalPages || onboardingStuckUsers.length === 0
                }
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Reminder Confirmation Dialog */}
        {reminderDialogOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Send Reminders
                    </h2>
                    <p className="text-slate-500">
                      Send reminder emails to selected users
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReminderDialogOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-300"
                  disabled={reminderLoading}
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-8">
                  <p className="text-slate-700 mb-6 text-lg">
                    Are you sure you want to send reminder emails to{" "}
                    <span className="font-bold text-blue-600">
                      {selectedUsers.length} user
                      {selectedUsers.length !== 1 ? "s" : ""}
                    </span>
                    ?
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                        <Mail className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Reminder Emails
                        </h3>
                        <p className="text-slate-600">
                          Users will receive a gentle reminder to complete their
                          onboarding
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          Selected: {selectedUsers.length} user
                          {selectedUsers.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    className="flex-1 px-6 py-4 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                    onClick={() => setReminderDialogOpen(false)}
                    disabled={reminderLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                    onClick={sendReminders}
                    disabled={reminderLoading}
                  >
                    {reminderLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="w-5 h-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Send className="w-5 h-5" />
                        Send Reminders
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
