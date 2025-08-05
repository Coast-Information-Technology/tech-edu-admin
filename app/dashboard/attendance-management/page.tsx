"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

interface Participant {
  participantType: string;
  platformRole: string;
  email: string;
  fullName: string;
  profileId?: string;
}

interface Calendar {
  eventId: string;
  joinUrl: string;
  synced: boolean;
}

interface Attendance {
  _id: string;
  sessionId?: string;
  classroomId?: string;
  productType: string;
  ledBy: string;
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  status: string;
  title: string;
  bookerType: string;
  bookerPlatformRole: string;
  bookerEmail: string;
  bookerFullName: string;
  participants: Participant[];
  numberOfExpectedParticipants: number;
  calendar?: Calendar;
  remarks?: string;
  isPostponed?: boolean;
  postponedTo?: {
    date: string;
    reason: string;
  };
  rescheduledFrom?: string;
  rescheduledMeetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  requestId: string;
  timestamp: string;
  durationMs: number;
  path: string;
}

export default function AttendanceManagementPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProductType, setFilterProductType] = useState("all");
  const [sortBy, setSortBy] = useState("scheduleAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<Meta | null>(null);

  const PRODUCT_TYPE_OPTIONS = [
    "Training & Certification",
    "Academic Support Services",
    "Career Development & Mentorship",
    "Institutional & Team Services",
    "AI-Powered or Automation Services",
    "Career Connect",
    "Marketing, Consultation & Free Services",
  ];

  const STATUS_OPTIONS = [
    "upcoming",
    "in_progress",
    "completed",
    "missed",
    "postponed",
  ];

  useEffect(() => {
    fetchAttendances();
  }, [page, limit, sortBy, sortOrder, filterStatus, filterProductType]);

  const fetchAttendances = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterProductType !== "all" && { productType: filterProductType }),
        ...(searchTerm && { search: searchTerm }),
      });

      const endpoint = `/api/attendance?${params}`;
      const response = await getApiRequest(endpoint, token);
      console.log("Attendance API response:", response);

      if (response?.data?.success) {
        setAttendances(response.data.data);
        setMeta(response.data.meta);
      } else {
        setError(response?.data?.message || "Failed to load attendances");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendances");
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "missed":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "postponed":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "in_progress":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "missed":
        return <XCircle className="w-4 h-4" />;
      case "postponed":
        return <Pause className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case "AcademicService":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "TrainingProgram":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "Consultancy":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchAttendances();
  };

  const handleRefresh = () => {
    fetchAttendances();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Attendance Management
              </h1>
              <p className="text-slate-600 text-lg">
                Monitor and manage attendance records for all sessions and
                classrooms
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  Refresh
                </span>
              </button>
              <div className="flex flex-col md:flex-row gap-3">
                <Link href="/dashboard/attendance-management/new">
                  <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Academic Session
                    </span>
                  </button>
                </Link>
                <Link href="/dashboard/attendance-management/classroom/new">
                  <button className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Classroom Session
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search attendances..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={filterProductType}
                    onChange={(e) => {
                      setFilterProductType(e.target.value);
                      setPage(1);
                    }}
                    className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="scheduleAt">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="productType">Sort by Type</option>
                  <option value="title">Sort by Title</option>
                  <option value="bookerFullName">Sort by Booker</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-5 w-5 text-slate-600" />
                ) : (
                  <SortDesc className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

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

        {/* Attendance Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading attendances...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Product Type
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Booker
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {attendances.length > 0 ? (
                    attendances.map((attendance) => (
                      <tr
                        key={attendance._id}
                        className="hover:bg-blue-50/50 transition-all duration-300 group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                              {attendance.title}
                            </div>
                            <div className="text-sm text-slate-500">
                              ID: {attendance._id.slice(-8)}
                            </div>
                            {attendance.remarks && (
                              <div className="text-xs text-slate-400 mt-1">
                                {attendance.remarks}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getProductTypeColor(
                              attendance.productType
                            )}`}
                          >
                            {attendance.productType}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDate(attendance.scheduleAt)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {attendance.durationInMinutes} minutes
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                              attendance.status
                            )}`}
                          >
                            {getStatusIcon(attendance.status)}
                            {attendance.status.replace("_", " ").toUpperCase()}
                          </span>
                          {attendance.isPostponed && (
                            <div className="text-xs text-orange-600 mt-1">
                              Postponed
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-900">
                              {attendance.numberOfExpectedParticipants}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {attendance.participants.length} enrolled
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {attendance.bookerFullName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {attendance.bookerEmail}
                            </div>
                            <div className="text-xs text-slate-400">
                              {attendance.bookerPlatformRole}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/attendance-management/${attendance._id}`}
                            >
                              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300 group-hover:bg-blue-100">
                                <Eye className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                              </button>
                            </Link>
                            <Link
                              href={`/dashboard/attendance-management/${attendance._id}/edit`}
                            >
                              <button className="p-2 rounded-full hover:bg-yellow-100 transition-all duration-300 group-hover:bg-yellow-100">
                                <Edit className="w-4 h-4 text-slate-600 group-hover:text-yellow-600 transition-colors duration-300" />
                              </button>
                            </Link>
                            {attendance.calendar?.joinUrl && (
                              <a
                                href={attendance.calendar.joinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 group-hover:bg-green-100"
                              >
                                <CalendarDays className="w-4 h-4 text-slate-600 group-hover:text-green-600 transition-colors duration-300" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-10 h-10 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              No attendance records found
                            </h3>
                            <p className="text-slate-600">
                              Get started by creating your first attendance
                              record
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
        {meta && meta.totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {meta.total}
                </span>{" "}
                attendance records
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page === 1 || attendances.length === 0}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={
                    meta.page === meta.totalPages || attendances.length === 0
                  }
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
