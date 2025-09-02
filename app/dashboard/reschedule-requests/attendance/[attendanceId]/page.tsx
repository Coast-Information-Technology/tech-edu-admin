"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  CalendarDays,
  UserCheck,
  UserX,
  ArrowUpDown,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface RescheduleRequest {
  _id: string;
  attendanceId: {
    _id: string;
    sessionId: {
      _id: string;
      title: string;
      sessionType: string;
      startTime: string;
      endTime: string;
    };
    studentId: {
      _id: string;
      fullName: string;
      email: string;
    };
    instructorId: {
      _id: string;
      fullName: string;
      email: string;
    };
    status: string;
  };
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  instructorId: {
    _id: string;
    fullName: string;
    email: string;
  };
  requestorId: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  gracePeriodEnd?: string;
  isWithinGracePeriod?: boolean;
}

interface GracePeriodStatus {
  isWithinGracePeriod: boolean;
  remainingTime: string;
  gracePeriodEnd: string;
  canBeRescheduled: boolean;
}

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_ICONS = {
  pending: <Clock className="w-4 h-4" />,
  approved: <CheckCircle className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
  completed: <UserCheck className="w-4 h-4" />,
};

export default function AttendanceRescheduleRequestsPage() {
  const params = useParams();
  const attendanceId = params.attendanceId as string;

  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [attendance, setAttendance] = useState<
    RescheduleRequest["attendanceId"] | null
  >(null);
  const [gracePeriodStatus, setGracePeriodStatus] =
    useState<GracePeriodStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    if (attendanceId) {
      fetchAttendanceRequests();
      fetchGracePeriodStatus();
    }
  }, [attendanceId]);

  const fetchAttendanceRequests = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await getApiRequest(
        `/api/reschedule/attendance/${attendanceId}`,
        token
      );

      if (response?.data?.success) {
        setRequests(response.data.data.requests || []);
        setAttendance(response.data.data.attendance);
      } else {
        setError(
          response?.data?.message || "Failed to load attendance requests"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendance requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchGracePeriodStatus = async () => {
    const token = getTokenFromCookies();
    if (!token) return;

    try {
      const response = await getApiRequest(
        `/api/reschedule/${attendanceId}/grace-period-status`,
        token
      );

      if (response?.data?.success) {
        setGracePeriodStatus(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch grace period status:", err);
    }
  };

  const handleApprove = async (requestId: string) => {
    setApproving(requestId);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await updateApiRequest(
        `/api/reschedule/${requestId}/approve`,
        token,
        {}
      );

      if (response?.data?.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: "approved" } : req
          )
        );
      } else {
        setError(response?.data?.message || "Failed to approve request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to approve request");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setRejecting(requestId);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await updateApiRequest(
        `/api/reschedule/${requestId}/reject`,
        token,
        {}
      );

      if (response?.data?.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, status: "rejected" } : req
          )
        );
      } else {
        setError(response?.data?.message || "Failed to reject request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reject request");
    } finally {
      setRejecting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeDifference = (oldTime: string, newTime: string) => {
    const old = new Date(oldTime);
    const newTimeDate = new Date(newTime);
    const diffMs = newTimeDate.getTime() - old.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours === 0) {
      return "Same time";
    } else if (diffHours > 0) {
      return `+${diffHours}h later`;
    } else {
      return `${Math.abs(diffHours)}h earlier`;
    }
  };

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.requestorId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.instructorId.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "oldStartTime":
          comparison =
            new Date(a.oldStartTime).getTime() -
            new Date(b.oldStartTime).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">
                Loading attendance requests...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/reschedule-requests">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Session Reschedule Requests
              </h1>
              <p className="text-slate-600">
                View all reschedule requests for this session
              </p>
            </div>
          </div>
        </div>

        {/* Session Information */}
        {attendance && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {attendance.sessionId.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Session Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Type:</span>{" "}
                        {attendance.sessionId.sessionType}
                      </p>
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(attendance.sessionId.startTime)}
                      </p>
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Time:</span>{" "}
                        {formatTime(attendance.sessionId.startTime)} -{" "}
                        {formatTime(attendance.sessionId.endTime)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Student
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Name:</span>{" "}
                        {attendance.studentId.fullName}
                      </p>
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Email:</span>{" "}
                        {attendance.studentId.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      Instructor
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Name:</span>{" "}
                        {attendance.instructorId.fullName}
                      </p>
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">Email:</span>{" "}
                        {attendance.instructorId.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    attendance.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {attendance.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grace Period Status */}
        {gracePeriodStatus && (
          <div
            className={`mb-8 rounded-2xl p-6 flex items-center gap-4 ${
              gracePeriodStatus.isWithinGracePeriod
                ? "bg-green-50/80 border border-green-200"
                : "bg-red-50/80 border border-red-200"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                gracePeriodStatus.isWithinGracePeriod
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {gracePeriodStatus.isWithinGracePeriod ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div>
              <h3
                className={`text-lg font-semibold ${
                  gracePeriodStatus.isWithinGracePeriod
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                Grace Period Status
              </h3>
              <p
                className={`${
                  gracePeriodStatus.isWithinGracePeriod
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {gracePeriodStatus.isWithinGracePeriod
                  ? `Within grace period - ${gracePeriodStatus.remainingTime} remaining`
                  : "Grace period expired - cannot be rescheduled"}
              </p>
              {gracePeriodStatus.gracePeriodEnd && (
                <p className="text-sm text-slate-600 mt-1">
                  Grace period ends:{" "}
                  {formatDate(gracePeriodStatus.gracePeriodEnd)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by requestor, instructor, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="createdAt">Created Date</option>
                <option value="oldStartTime">Session Date</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 bg-white/50 border border-slate-200 rounded-xl hover:bg-white/80 transition-all duration-300"
              >
                <ArrowUpDown className="w-4 h-4 text-slate-600" />
              </button>

              <button
                onClick={fetchAttendanceRequests}
                className="p-2 bg-white/50 border border-slate-200 rounded-xl hover:bg-white/80 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Requestor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Current Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    New Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <BookOpen className="w-12 h-12 text-slate-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-600">
                            No reschedule requests found
                          </h3>
                          <p className="text-slate-500">
                            {searchTerm || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "This session has no reschedule requests"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-slate-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {request.requestorId.fullName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {request.requestorId.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {request.instructorId.fullName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {request.instructorId.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formatDate(request.oldStartTime)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {formatTime(request.oldStartTime)} -{" "}
                            {formatTime(request.oldEndTime)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {formatDate(request.newStartTime)}
                          </p>
                          <p className="text-sm text-slate-600">
                            {formatTime(request.newStartTime)} -{" "}
                            {formatTime(request.newEndTime)}
                          </p>
                          <p className="text-xs text-blue-600 font-medium">
                            {getTimeDifference(
                              request.oldStartTime,
                              request.newStartTime
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                            STATUS_COLORS[request.status]
                          }`}
                        >
                          {STATUS_ICONS[request.status]}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-900">
                            {formatDate(request.createdAt)}
                          </p>
                          <p className="text-xs text-slate-600">
                            {request.isWithinGracePeriod
                              ? "Within grace period"
                              : "Grace period expired"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/reschedule-requests/${request._id}`}
                          >
                            <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>

                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(request._id)}
                                disabled={approving === request._id}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              >
                                {approving === request._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleReject(request._id)}
                                disabled={rejecting === request._id}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                              >
                                {rejecting === request._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
