"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Users,
  ArrowRight,
  BookOpen,
  Calendar,
  Video,
  Settings,
  Clock,
  Plus,
  BarChart3,
  FileText,
  CheckCircle,
  Star,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  XCircle,
  Play,
  Pause,
  User,
  Building,
  Users2,
  MapPin,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface Session {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  instructorId: string;
  scheduleAt: string;
  endAt?: string;
  minutesPerSession: number;
  numberOfExpectedParticipants: number;
  meetingLink?: string;
  sessionType: "group" | "1-on-1";
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  avgRating?: number;
  userNotes?: string;
  internalNotes?: string;
  participants: Array<{
    participantType: string;
    platformRole: string;
    profileId?: string;
    email: string;
    fullName: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortKey, setSortKey] = useState("scheduleAt");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchSessions();
  }, []);

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
      const response = await getApiRequest("/api/sessions/admin/all", token);

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

  // Filter and sort logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.bookingPurpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    const matchesType =
      filterType === "all" || session.sessionType === filterType;

    return matchesSearch && matchesStatus && matchesType;
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
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
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType) {
      case "group":
        return <Users2 className="w-4 h-4" />;
      case "1-on-1":
        return <User className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getParticipantTypeIcon = (participantType: string) => {
    switch (participantType) {
      case "institution":
        return <Building className="w-4 h-4" />;
      case "team":
        return <Users2 className="w-4 h-4" />;
      case "individual":
        return <User className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTimeUntilSession = (scheduleAt: string) => {
    const now = new Date();
    const sessionTime = new Date(scheduleAt);
    const diffMs = sessionTime.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffMs < 0) {
      return "Past";
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
    } else {
      return "Starting soon";
    }
  };

  const getQuickStats = () => {
    const total = sessions.length;
    const upcoming = sessions.filter((s) => s.status === "upcoming").length;
    const confirmed = sessions.filter((s) => s.status === "confirmed").length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    const cancelled = sessions.filter((s) => s.status === "cancelled").length;

    const avgRating =
      sessions
        .filter((s) => s.avgRating)
        .reduce((acc, s) => acc + (s.avgRating || 0), 0) /
      sessions.filter((s) => s.avgRating).length;

    return {
      total,
      upcoming,
      confirmed,
      completed,
      cancelled,
      avgRating: avgRating || 0,
    };
  };

  const stats = getQuickStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Session Management
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and monitor all sessions across the platform
              </p>
            </div>
            <div className="flex gap-3">
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.total}
            </h3>
            <p className="text-slate-600 text-sm">Total Sessions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.upcoming}
            </h3>
            <p className="text-slate-600 text-sm">Upcoming</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.confirmed}
            </h3>
            <p className="text-slate-600 text-sm">Confirmed</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.completed}
            </h3>
            <p className="text-slate-600 text-sm">Completed</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats.avgRating.toFixed(1)}
            </h3>
            <p className="text-slate-600 text-sm">Avg Rating</p>
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
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="group">Group</option>
                    <option value="1-on-1">1-on-1</option>
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

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 animate-pulse"
              >
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-6 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : paginatedSessions.length > 0 ? (
            paginatedSessions.map((session) => (
              <div
                key={session._id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Session Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
                      {session.bookingPurpose}
                    </h3>
                    <p className="text-sm text-slate-500">
                      ID: {session._id.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedSession(
                        expandedSession === session._id ? null : session._id
                      )
                    }
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200"
                  >
                    {expandedSession === session._id ? (
                      <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* Session Type & Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                    {getSessionTypeIcon(session.sessionType)}
                    {session.sessionType}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      session.status
                    )}`}
                  >
                    {getStatusIcon(session.status)}
                    {session.status}
                  </span>
                </div>

                {/* Schedule Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{formatDate(session.scheduleAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>
                      {formatTime(session.scheduleAt)} -{" "}
                      {session.endAt
                        ? formatTime(session.endAt)
                        : `${session.minutesPerSession} min`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {getTimeUntilSession(session.scheduleAt)}
                  </div>
                </div>

                {/* Product & Participants */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{session.productType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>
                      {session.numberOfExpectedParticipants} participants
                    </span>
                  </div>
                </div>

                {/* Rating */}
                {session.avgRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-slate-700">
                      {session.avgRating.toFixed(1)} rating
                    </span>
                  </div>
                )}

                {/* Meeting Link */}
                {session.meetingLink && (
                  <div className="mb-4">
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-[12px] text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  </div>
                )}

                {/* Expanded Content */}
                {expandedSession === session._id && (
                  <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
                    {/* Participants */}
                    {session.participants &&
                      session.participants.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            Participants
                          </h4>
                          <div className="space-y-2">
                            {session.participants.map((participant, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm"
                              >
                                {getParticipantTypeIcon(
                                  participant.participantType
                                )}
                                <span className="font-medium">
                                  {participant.fullName}
                                </span>
                                <span className="text-slate-500">
                                  ({participant.platformRole})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Notes */}
                    {(session.userNotes || session.internalNotes) && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">
                          Notes
                        </h4>
                        {session.userNotes && (
                          <div className="text-sm text-slate-600 mb-2">
                            <span className="font-medium">User:</span>{" "}
                            {session.userNotes}
                          </div>
                        )}
                        {session.internalNotes && (
                          <div className="text-sm text-slate-600">
                            <span className="font-medium">Internal:</span>{" "}
                            {session.internalNotes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link href={`/dashboard/sessions/${session._id}`}>
                        <button className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                      </Link>
                      {session.status === "upcoming" && (
                        <Link href={`/dashboard/sessions/${session._id}/edit`}>
                          <button className="p-2 rounded-full hover:bg-yellow-100 transition-colors duration-200">
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                        </Link>
                      )}
                      {session.status === "confirmed" && (
                        <Link
                          href={`/dashboard/sessions/${session._id}/complete`}
                        >
                          <button className="p-2 rounded-full hover:bg-green-100 transition-colors duration-200">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-16 text-center">
              <div className="flex flex-col items-center gap-4 py-8">
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
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
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
