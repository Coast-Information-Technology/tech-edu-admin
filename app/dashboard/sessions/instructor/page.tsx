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
  CheckCircle,
  XCircle,
  Play,
  Star,
} from "lucide-react";
import Link from "next/link";

interface Session {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose?: string;
  instructorId?: string;
  scheduleAt: string;
  endAt?: string;
  minutesPerSession?: number;
  numberOfExpectedParticipants?: number;
  meetingLink?: string;
  sessionType?: string;
  status: string;
  userNotes?: string;
  internalNotes?: string;
  avgRating?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function InstructorSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSessionType, setFilterSessionType] = useState("all");
  const [sortKey, setSortKey] = useState("scheduleAt");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const endpoint = "/api/sessions/instructor/my-sessions";
        const response = await getApiRequest(endpoint, token);
        console.log("Instructor Sessions API response:", response);

        if (response?.data?.success) {
          setSessions(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load sessions");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load sessions");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Filter and sort logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.bookingPurpose
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;

    const matchesSessionType =
      filterSessionType === "all" || session.sessionType === filterSessionType;

    return matchesSearch && matchesStatus && matchesSessionType;
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let aVal = a[sortKey as keyof Session];
    let bVal = b[sortKey as keyof Session];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);
  const paginatedSessions = sortedSessions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      case "confirmed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "confirmed":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSessionTypeColor = (sessionType: string) => {
    switch (sessionType?.toLowerCase()) {
      case "1-on-1":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "group":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
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
                Instructor Sessions
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your individual and group sessions
              </p>
            </div>
            <Link href="/dashboard/sessions/new">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Create Session
                </span>
              </button>
            </Link>
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search sessions..."
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
                    <option value="upcoming">Upcoming</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={filterSessionType}
                    onChange={(e) => {
                      setFilterSessionType(e.target.value);
                      setPage(1);
                    }}
                    className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="1-on-1">1-on-1</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="scheduleAt">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="productType">Sort by Type</option>
                  <option value="sessionType">Sort by Session Type</option>
                  <option value="numberOfExpectedParticipants">
                    Sort by Participants
                  </option>
                </select>
              </div>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
              >
                {sortDirection === "asc" ? (
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
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading sessions...</p>
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
                      Session Type
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
                      Rating
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {paginatedSessions.length > 0 ? (
                    paginatedSessions.map((session) => (
                      <tr
                        key={session._id}
                        className="hover:bg-blue-50/50 transition-all duration-300 group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                              {session.bookingPurpose || "Mentoring Session"}
                            </div>
                            <div className="text-sm text-slate-500">
                              ID: {session._id.slice(-8)}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                            {session.productType}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getSessionTypeColor(
                              session.sessionType || ""
                            )}`}
                          >
                            {session.sessionType || "N/A"}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDate(session.scheduleAt)}
                          </div>
                          {session.minutesPerSession && (
                            <div className="text-xs text-slate-500 mt-1">
                              {session.minutesPerSession} minutes
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                              session.status
                            )}`}
                          >
                            {getStatusIcon(session.status)}
                            {session.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-900">
                              {session.numberOfExpectedParticipants || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          {session.avgRating ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-slate-900">
                                {session.avgRating.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">
                              No rating
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/sessions/${session._id}`}>
                              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300 group-hover:bg-blue-100">
                                <Eye className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                              </button>
                            </Link>
                            {session.status === "upcoming" && (
                              <Link
                                href={`/dashboard/sessions/${session._id}/edit`}
                              >
                                <button className="p-2 rounded-full hover:bg-yellow-100 transition-all duration-300 group-hover:bg-yellow-100">
                                  <Edit className="w-4 h-4 text-slate-600 group-hover:text-yellow-600 transition-colors duration-300" />
                                </button>
                              </Link>
                            )}
                            {session.status === "confirmed" && (
                              <Link
                                href={`/dashboard/sessions/${session._id}/complete`}
                              >
                                <button className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 group-hover:bg-green-100">
                                  <CheckCircle className="w-4 h-4 text-slate-600 group-hover:text-green-600 transition-colors duration-300" />
                                </button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              No sessions found
                            </h3>
                            <p className="text-slate-600">
                              Get started by creating your first session
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
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    (page - 1) * itemsPerPage + 1,
                    sortedSessions.length
                  )}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(page * itemsPerPage, sortedSessions.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {sortedSessions.length}
                </span>{" "}
                sessions
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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
