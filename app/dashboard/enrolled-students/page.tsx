"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  Target,
  TrendingUp,
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
  // Booking data that contains student info
  booking?: {
    _id: string;
    createdBy: {
      _id: string;
      fullName: string;
      email: string;
      platformRole: string;
    };
    participantType: string;
    status: string;
    createdAt: string;
  };
}

interface Classroom {
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
  status: string;
  instructorNotes?: string;
  internalNotes?: string;
  actualDaysAndTime?: Array<{
    day: string;
    time: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  // Booking data that contains student info
  booking?: {
    _id: string;
    createdBy: {
      _id: string;
      fullName: string;
      email: string;
      platformRole: string;
    };
    participantType: string;
    status: string;
    createdAt: string;
  };
}

interface EnrolledStudent {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  platformRole: string;
  enrollmentDate: string;
  lastActive: string;
  totalSessions: number;
  completedSessions: number;
  attendanceRate: number;
  averageRating: number;
  currentCourses: string[];
  upcomingSessions: {
    sessionId: string;
    sessionTitle: string;
    scheduleAt: string;
    status: string;
  }[];
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
  }[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function EnrolledStudentsPage() {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<Meta | null>(null);

  const ROLE_OPTIONS = [
    "student",
    "individualTechProfessional",
    "teamTechProfessional",
    "institution",
  ];

  const STATUS_OPTIONS = ["active", "inactive", "completed", "dropped"];

  useEffect(() => {
    fetchEnrolledStudents();
  }, [page, limit, filterRole, filterStatus]);

  const fetchEnrolledStudents = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // Fetch both sessions and classrooms to get all enrolled students
      const responses = await Promise.all([
        getApiRequest("/api/sessions/instructor/my-sessions", token),
        getApiRequest("/api/classrooms/instructor/my-classrooms", token),
      ]);
      const [sessionsResponse, classroomsResponse] = responses;

      console.log("Sessions API response:", sessionsResponse);
      console.log("Classrooms API response:", classroomsResponse);

      const sessions: Session[] = sessionsResponse?.data?.success
        ? sessionsResponse.data.data
        : [];
      const classrooms: Classroom[] = classroomsResponse?.data?.success
        ? classroomsResponse.data.data
        : [];

      // Extract unique students from sessions and classrooms
      const studentsMap = new Map<string, EnrolledStudent>();

      // Process sessions
      sessions.forEach((session) => {
        if (session.booking?.createdBy) {
          const studentId = session.booking.createdBy._id;
          const student = session.booking.createdBy;

          if (!studentsMap.has(studentId)) {
            studentsMap.set(studentId, {
              _id: studentId,
              fullName: student.fullName,
              email: student.email,
              platformRole: student.platformRole,
              enrollmentDate: session.booking.createdAt,
              lastActive: session.updatedAt || session.createdAt,
              totalSessions: 0,
              completedSessions: 0,
              attendanceRate: 0,
              averageRating: 0,
              currentCourses: [],
              upcomingSessions: [],
              recentActivity: [],
            });
          }

          const enrolledStudent = studentsMap.get(studentId)!;
          enrolledStudent.totalSessions++;

          if (session.status === "completed") {
            enrolledStudent.completedSessions++;
          }

          if (session.status === "upcoming" || session.status === "confirmed") {
            enrolledStudent.upcomingSessions.push({
              sessionId: session._id,
              sessionTitle: session.bookingPurpose || "Session",
              scheduleAt: session.scheduleAt,
              status: session.status,
            });
          }

          if (session.avgRating) {
            enrolledStudent.averageRating =
              (enrolledStudent.averageRating + session.avgRating) / 2;
          }

          enrolledStudent.currentCourses.push(session.productType);
        }
      });

      // Process classrooms
      classrooms.forEach((classroom) => {
        if (classroom.booking?.createdBy) {
          const studentId = classroom.booking.createdBy._id;
          const student = classroom.booking.createdBy;

          if (!studentsMap.has(studentId)) {
            studentsMap.set(studentId, {
              _id: studentId,
              fullName: student.fullName,
              email: student.email,
              platformRole: student.platformRole,
              enrollmentDate: classroom.booking.createdAt,
              lastActive: classroom.updatedAt || classroom.createdAt,
              totalSessions: 0,
              completedSessions: 0,
              attendanceRate: 0,
              averageRating: 0,
              currentCourses: [],
              upcomingSessions: [],
              recentActivity: [],
            });
          }

          const enrolledStudent = studentsMap.get(studentId)!;
          enrolledStudent.totalSessions++;

          if (classroom.status === "completed") {
            enrolledStudent.completedSessions++;
          }

          if (
            classroom.status === "upcoming" ||
            classroom.status === "active"
          ) {
            enrolledStudent.upcomingSessions.push({
              sessionId: classroom._id,
              sessionTitle: classroom.bookingPurpose || "Classroom Session",
              scheduleAt: classroom.scheduleAt,
              status: classroom.status,
            });
          }

          enrolledStudent.currentCourses.push(classroom.productType);
        }
      });

      // Convert map to array and calculate attendance rates
      const studentsArray = Array.from(studentsMap.values()).map((student) => ({
        ...student,
        attendanceRate:
          student.totalSessions > 0
            ? Math.round(
                (student.completedSessions / student.totalSessions) * 100
              )
            : 0,
        currentCourses: [...new Set(student.currentCourses)], // Remove duplicates
        upcomingSessions: student.upcomingSessions.slice(0, 5), // Limit to 5 upcoming sessions
      }));

      // Apply filters
      let filteredStudents = studentsArray.filter((student) => {
        const matchesSearch =
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
          filterRole === "all" || student.platformRole === filterRole;

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "active" && student.attendanceRate > 0) ||
          (filterStatus === "inactive" && student.attendanceRate === 0) ||
          (filterStatus === "completed" &&
            student.completedSessions === student.totalSessions) ||
          (filterStatus === "dropped" && student.attendanceRate < 50);

        return matchesSearch && matchesRole && matchesStatus;
      });

      // Apply pagination
      const total = filteredStudents.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

      setStudents(paginatedStudents);
      setMeta({
        total,
        page,
        limit,
        totalPages,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load enrolled students");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "individualTechProfessional":
        return "bg-green-100 text-green-800 border-green-200";
      case "teamTechProfessional":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "institution":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSearch = () => {
    setPage(1);
    fetchEnrolledStudents();
  };

  const handleRefresh = () => {
    fetchEnrolledStudents();
  };

  const handleContactStudent = (student: EnrolledStudent) => {
    // TODO: Implement contact functionality (email, chat, etc.)
    console.log(`Contacting student: ${student.email}`);
  };

  const handleViewProfile = (studentId: string) => {
    // TODO: Navigate to student profile
    console.log(`Viewing profile for student: ${studentId}`);
  };

  const handleViewSessions = (studentId: string) => {
    // TODO: Navigate to student sessions
    console.log(`Viewing sessions for student: ${studentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Enrolled Students
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and track your enrolled students across all sessions and
                courses
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRefresh}
                className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  Refresh
                </span>
              </button>
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
                  placeholder="Search students by name or email..."
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() +
                          role.slice(1).replace(/([A-Z])/g, " $1")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search
              </span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                No enrolled students found
              </p>
              <p className="text-slate-500">
                You don't have any students enrolled in your sessions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Student Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        {student.profileImageUrl ? (
                          <img
                            src={student.profileImageUrl}
                            alt={student.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">
                            {student.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {student.fullName}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {student.email}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            student.platformRole
                          )}`}
                        >
                          {student.platformRole.charAt(0).toUpperCase() +
                            student.platformRole
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")}
                        </span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">
                          {student.completedSessions}
                        </p>
                        <p className="text-xs text-slate-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-2xl font-bold ${getAttendanceColor(
                            student.attendanceRate
                          )}`}
                        >
                          {student.attendanceRate}%
                        </p>
                        <p className="text-xs text-slate-600">Attendance</p>
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">
                            Sessions Progress
                          </span>
                          <span className="text-slate-900">
                            {student.completedSessions}/{student.totalSessions}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                student.totalSessions > 0
                                  ? (student.completedSessions /
                                      student.totalSessions) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Rating</span>
                          <span
                            className={`font-medium ${getRatingColor(
                              student.averageRating
                            )}`}
                          >
                            {student.averageRating.toFixed(1)} ⭐
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Sessions */}
                    {student.upcomingSessions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 mb-2">
                          Upcoming Sessions
                        </h4>
                        <div className="space-y-2">
                          {student.upcomingSessions
                            .slice(0, 2)
                            .map((session, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs"
                              >
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span className="text-slate-600 truncate">
                                  {session.sessionTitle}
                                </span>
                                <span className="text-slate-500">
                                  {formatDateTime(session.scheduleAt)}
                                </span>
                              </div>
                            ))}
                          {student.upcomingSessions.length > 2 && (
                            <p className="text-xs text-slate-500">
                              +{student.upcomingSessions.length - 2} more
                              sessions
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(student._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="w-3 h-3" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleViewSessions(student._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
                      >
                        <Video className="w-3 h-3" />
                        Sessions
                      </button>
                      <button
                        onClick={() => handleContactStudent(student)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                        title="Contact Student"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Last Active */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Last active: {formatDate(student.lastActive)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} students
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.totalPages}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
