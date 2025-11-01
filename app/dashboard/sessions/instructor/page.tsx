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
  User,
  Users2,
  Building,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/ui/star-rating";

interface Session {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  instructorId?: string;
  scheduleAt: string;
  endAt?: string;
  minutesPerSession?: number;
  numberOfExpectedParticipants: number;
  meetingLink?: string;
  materialUrl?: string;
  sessionType: "group" | "1-on-1";
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  avgRating?: number;
  internalNotes?: string;
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

  // Modal states
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [completing, setCompleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Form states for completion
  const [avgRating, setAvgRating] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

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

  // Handle session completion
  const handleCompleteSession = async () => {
    if (!selectedSession) return;

    setCompleting(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const { updateApiRequest } = await import("@/lib/apiFetch");
      const response = await updateApiRequest(
        `/api/sessions/${selectedSession._id}/complete`,
        token,
        {
          avgRating: avgRating ? parseFloat(avgRating) : undefined,
          internalNotes: internalNotes || undefined,
        }
      );

      if (response?.data?.success) {
        // Update the session in the list
        setSessions((prev) =>
          prev.map((session) =>
            session._id === selectedSession._id
              ? { ...session, ...response.data.data }
              : session
          )
        );
        setShowCompleteModal(false);
        setSelectedSession(null);
        setAvgRating("");
        setInternalNotes("");
        setError(null);
      } else {
        setError(response?.data?.message || "Failed to complete session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete session");
    } finally {
      setCompleting(false);
    }
  };

  // Handle session cancellation
  const handleCancelSession = async () => {
    if (!selectedSession) return;

    setCancelling(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const { updateApiRequest } = await import("@/lib/apiFetch");
      const response = await updateApiRequest(
        `/api/sessions/${selectedSession._id}/cancel`,
        token,
        {}
      );

      if (response?.data?.success) {
        // Update the session in the list
        setSessions((prev) =>
          prev.map((session) =>
            session._id === selectedSession._id
              ? { ...session, ...response.data.data }
              : session
          )
        );
        setShowCancelModal(false);
        setSelectedSession(null);
        setError(null);
      } else {
        setError(response?.data?.message || "Failed to cancel session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel session");
    } finally {
      setCancelling(false);
    }
  };

  // Open complete modal
  const openCompleteModal = (session: Session) => {
    setSelectedSession(session);
    setShowCompleteModal(true);
  };

  // Open cancel modal
  const openCancelModal = (session: Session) => {
    setSelectedSession(session);
    setShowCancelModal(true);
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

  // Get session type icon
  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType) {
      case "group":
        return <Users className="w-4 h-4" />;
      case "1-on-1":
        return <User className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  // Format time until session
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

  // Get participant type icon
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

        {/* Sessions Cards */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">Loading sessions...</p>
              </div>
            </div>
          ) : paginatedSessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                        {session.bookingPurpose}
                      </h3>
                      <p className="text-sm text-slate-500">
                        ID: {session._id.slice(-8)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                  </div>

                  {/* Product Type & Session Type */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                      {session.productType}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getSessionTypeColor(
                        session.sessionType
                      )}`}
                    >
                      {getSessionTypeIcon(session.sessionType)}
                      {session.sessionType}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className="mb-4 p-4 bg-slate-50/80 rounded-[12px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        Schedule
                      </span>
                    </div>
                    <div className="text-sm text-slate-900 font-medium">
                      {formatDate(session.scheduleAt)}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {session.minutesPerSession
                        ? `${session.minutesPerSession} minutes • `
                        : ""}
                      {getTimeUntilSession(session.scheduleAt)}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mb-4 p-4 bg-slate-50/80 rounded-[12px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">
                        Participants
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        {session.numberOfExpectedParticipants} expected
                      </span>
                    </div>
                  </div>

                  {/* Meeting Link & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      {session.meetingLink ? (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </a>
                      ) : (
                        <span className="text-sm text-slate-500">
                          Meeting link will be provided
                        </span>
                      )}
                    </div>
                    {session.avgRating && (
                      <StarRating
                        value={session.avgRating}
                        onChange={() => {}}
                        size="sm"
                        showValue={true}
                        readonly={true}
                        className="justify-start"
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                    <Link href={`/dashboard/sessions/${session._id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/50 border border-slate-200 rounded-[12px] hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-300">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Link>
                    {session.status === "upcoming" && (
                      <Link href={`/dashboard/sessions/${session._id}/edit`}>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white/50 border border-slate-200 rounded-[12px] hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-all duration-300">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </Link>
                    )}
                    {(session.status === "confirmed" ||
                      session.status === "upcoming") && (
                      <button
                        onClick={() => openCompleteModal(session)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-[12px] hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                    )}
                    {(session.status === "upcoming" ||
                      session.status === "confirmed") && (
                      <button
                        onClick={() => openCancelModal(session)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-[12px] hover:from-red-700 hover:to-pink-700 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
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

        {/* Complete Session Modal */}
        {showCompleteModal && selectedSession && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Complete Session
                </h3>
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    Session:{" "}
                    <span className="font-medium">
                      {selectedSession.bookingPurpose}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Scheduled:{" "}
                    <span className="font-medium">
                      {formatDate(selectedSession.scheduleAt)}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Average Rating (Optional)
                  </label>
                  <div className="bg-white/50 border border-slate-200 rounded-2xl p-4">
                    <StarRating
                      value={parseFloat(avgRating) || 0}
                      onChange={(rating) => setAvgRating(rating.toString())}
                      max={5}
                      size="lg"
                      showValue={true}
                      allowHalf={true}
                      className="justify-center"
                    />
                    <p className="text-xs text-slate-500 text-center mt-2">
                      Click on a star to rate the session
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Internal Notes (Optional)
                  </label>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Session completed successfully. Student showed good understanding of the concepts."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-2xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSession}
                  disabled={completing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Session Modal */}
        {showCancelModal && selectedSession && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Cancel Session
                </h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    Session:{" "}
                    <span className="font-medium">
                      {selectedSession.bookingPurpose}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Scheduled:{" "}
                    <span className="font-medium">
                      {formatDate(selectedSession.scheduleAt)}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-[12px]">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Warning
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    Are you sure you want to cancel this session? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-2xl transition-all duration-300"
                >
                  Keep Session
                </button>
                <button
                  onClick={handleCancelSession}
                  disabled={cancelling}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Cancel Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
