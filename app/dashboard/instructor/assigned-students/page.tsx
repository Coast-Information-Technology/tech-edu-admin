"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  MessageCircle,
  Calendar,
  Star,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  UserCheck,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface AssignedStudent {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  academicLevel: string;
  currentInstitution: string;
  fieldOfStudy: string;
  graduationYear: number;
  interestAreas: string[];
  progress: {
    completedSessions: number;
    totalSessions: number;
    lastSessionDate: string;
    nextSessionDate?: string;
  };
  performance: {
    averageRating: number;
    totalRatings: number;
    assignmentsCompleted: number;
    assignmentsPending: number;
  };
  status: "active" | "inactive" | "pending" | "completed";
  assignedDate: string;
  lastActive: string;
  notes?: string;
}

interface StudentStats {
  totalAssigned: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  totalSessions: number;
  upcomingSessions: number;
}

export default function AssignedStudentsPage() {
  const { userData } = useRole();
  const router = useRouter();
  const [students, setStudents] = useState<AssignedStudent[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        setLoading(true);
        const token = getTokenFromCookies();
        if (!token) {
          router.push("/login");
          return;
        }

        const instructorId = userData._id || userData.id;
        if (!instructorId) {
          setError("Instructor ID not found.");
          return;
        }

        // For now, show placeholder data since student assignment APIs are not available
        // TODO: Implement proper student assignment APIs for instructors

        // Create mock data for demonstration
        const mockStudents = [
          {
            _id: "student-1",
            fullName: "John Doe",
            email: "john.doe@example.com",
            profileImageUrl: undefined,
            academicLevel: "Undergraduate",
            currentInstitution: "University of Technology",
            fieldOfStudy: "Computer Science",
            graduationYear: 2025,
            interestAreas: ["Web Development", "Machine Learning"],
            progress: {
              completedSessions: 8,
              totalSessions: 12,
              lastSessionDate: new Date().toISOString(),
              nextSessionDate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            performance: {
              averageRating: 4.5,
              totalRatings: 15,
              assignmentsCompleted: 7,
              assignmentsPending: 2,
            },
            status: "active" as const,
            assignedDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            lastActive: new Date().toISOString(),
            notes: "Excellent progress in React development",
          },
          {
            _id: "student-2",
            fullName: "Jane Smith",
            email: "jane.smith@example.com",
            profileImageUrl: undefined,
            academicLevel: "Graduate",
            currentInstitution: "Tech Institute",
            fieldOfStudy: "Software Engineering",
            graduationYear: 2024,
            interestAreas: ["Full Stack Development", "DevOps"],
            progress: {
              completedSessions: 15,
              totalSessions: 20,
              lastSessionDate: new Date().toISOString(),
              nextSessionDate: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            performance: {
              averageRating: 4.8,
              totalRatings: 22,
              assignmentsCompleted: 12,
              assignmentsPending: 1,
            },
            status: "active" as const,
            assignedDate: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000
            ).toISOString(),
            lastActive: new Date().toISOString(),
            notes: "Strong technical skills, ready for advanced topics",
          },
        ];

        setStudents(mockStudents);

        // Calculate stats
        setStats({
          totalAssigned: mockStudents.length,
          activeStudents: mockStudents.filter((s: any) => s.status === "active")
            .length,
          completedStudents: mockStudents.filter(
            (s: any) => s.status === "completed"
          ).length,
          averageProgress:
            mockStudents.length > 0
              ? mockStudents.reduce(
                  (acc: any, s: any) =>
                    acc +
                    s.progress.completedSessions / s.progress.totalSessions,
                  0
                ) / mockStudents.length
              : 0,
          totalSessions: mockStudents.reduce(
            (acc: any, s: any) => acc + s.progress.totalSessions,
            0
          ),
          upcomingSessions: mockStudents.reduce(
            (acc: any, s: any) => acc + (s.progress.nextSessionDate ? 1 : 0),
            0
          ),
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch assigned students");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, [userData]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fieldOfStudy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.fullName.localeCompare(b.fullName);
        break;
      case "progress":
        comparison =
          a.progress.completedSessions - b.progress.completedSessions;
        break;
      case "rating":
        comparison = a.performance.averageRating - b.performance.averageRating;
        break;
      case "assigned":
        comparison =
          new Date(a.assignedDate).getTime() -
          new Date(b.assignedDate).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assigned students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Assigned Students
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and track your assigned students' progress
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/instructor/students"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                All Students
              </Link>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Assign Student
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.totalAssigned}
                  </h3>
                  <p className="text-slate-600 text-sm">Total Assigned</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.activeStudents}
                  </h3>
                  <p className="text-slate-600 text-sm">Active Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-[12px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.completedStudents}
                  </h3>
                  <p className="text-slate-600 text-sm">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-[12px] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.upcomingSessions}
                  </h3>
                  <p className="text-slate-600 text-sm">Upcoming Sessions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or field of study..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="rating">Sort by Rating</option>
                <option value="assigned">Sort by Assigned Date</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-5 h-5" />
                ) : (
                  <SortDesc className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {sortedStudents.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {sortedStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      {student.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {student.fullName}
                          </h3>
                          <p className="text-slate-600">{student.email}</p>
                          <p className="text-slate-500 text-sm">
                            {student.fieldOfStudy} • {student.academicLevel}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              student.status
                            )}`}
                          >
                            {student.status}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-slate-700 font-semibold">
                              {student.performance.averageRating.toFixed(1)}
                            </span>
                            <span className="text-slate-500 text-sm">
                              ({student.performance.totalRatings})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-slate-600 text-sm mb-1">
                            Progress
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${getProgressPercentage(
                                    student.progress.completedSessions,
                                    student.progress.totalSessions
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-slate-700 text-sm font-medium">
                              {student.progress.completedSessions}/
                              {student.progress.totalSessions}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-slate-600 text-sm mb-1">
                            Assignments
                          </p>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-slate-700 text-sm">
                              {student.performance.assignmentsCompleted}{" "}
                              completed
                            </span>
                          </div>
                          {student.performance.assignmentsPending > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-slate-700 text-sm">
                                {student.performance.assignmentsPending} pending
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-slate-600 text-sm mb-1">
                            Next Session
                          </p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-slate-700 text-sm">
                              {student.progress.nextSessionDate
                                ? new Date(
                                    student.progress.nextSessionDate
                                  ).toLocaleDateString()
                                : "Not scheduled"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/instructor/students/${student._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-[12px] hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Link>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-[12px] hover:bg-green-700 transition-colors flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-[12px] hover:bg-purple-700 transition-colors flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No assigned students found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any assigned students yet"}
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Assign Student
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
