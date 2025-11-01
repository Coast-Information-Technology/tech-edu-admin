"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { getCurrencySymbol } from "@/lib/constants/currencies";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  Calendar,
  Star,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Award,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface TrainingProgram {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  duration: number; // in hours
  difficulty: "beginner" | "intermediate" | "advanced";
  price: number;
  currency: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  status: "draft" | "published" | "archived" | "paused";
  enrollmentCount: number;
  maxEnrollment?: number;
  averageRating: number;
  totalRatings: number;
  completionRate: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  startDate: string;
  endDate?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  curriculum: {
    module: string;
    lessons: {
      title: string;
      duration: number;
      type: "video" | "text" | "quiz" | "assignment";
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ProgramStats {
  totalPrograms: number;
  publishedPrograms: number;
  draftPrograms: number;
  totalEnrollments: number;
  averageRating: number;
  totalRevenue: number;
  monthlyRevenue: number;
  completionRate: number;
  topCategories: { category: string; count: number }[];
  recentEnrollments: number;
}

export default function TrainingProgramsPage() {
  const { userData } = useRole();
  const router = useRouter();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [stats, setStats] = useState<ProgramStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTrainingPrograms = async () => {
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

        // For now, show placeholder data since training program APIs are not available for instructors
        // TODO: Implement proper training program APIs for instructors

        // Create mock data for demonstration
        const mockPrograms = [
          {
            _id: "program-1",
            title: "React Fundamentals",
            description: "Learn the basics of React.js development",
            category: "Web Development",
            subcategory: "Frontend",
            duration: 40,
            difficulty: "beginner" as const,
            price: 299,
            currency: "USD",
            thumbnailUrl: undefined,
            instructorId: instructorId,
            instructorName: "Your Name",
            status: "published" as const,
            enrollmentCount: 25,
            maxEnrollment: 50,
            averageRating: 4.7,
            totalRatings: 18,
            completionRate: 0.85,
            totalSessions: 20,
            completedSessions: 17,
            upcomingSessions: 3,
            startDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            tags: ["React", "JavaScript", "Frontend"],
            prerequisites: ["Basic HTML/CSS", "JavaScript fundamentals"],
            learningObjectives: [
              "Build React components",
              "Manage state",
              "Handle events",
            ],
            curriculum: [
              {
                module: "Introduction to React",
                lessons: [
                  {
                    title: "What is React?",
                    duration: 30,
                    type: "video" as const,
                  },
                  {
                    title: "Setting up your environment",
                    duration: 45,
                    type: "text" as const,
                  },
                ],
              },
            ],
            createdAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "program-2",
            title: "Advanced Node.js",
            description: "Master server-side JavaScript development",
            category: "Backend Development",
            subcategory: "Server",
            duration: 60,
            difficulty: "intermediate" as const,
            price: 499,
            currency: "USD",
            thumbnailUrl: undefined,
            instructorId: instructorId,
            instructorName: "Your Name",
            status: "published" as const,
            enrollmentCount: 15,
            maxEnrollment: 30,
            averageRating: 4.9,
            totalRatings: 12,
            completionRate: 0.92,
            totalSessions: 30,
            completedSessions: 28,
            upcomingSessions: 2,
            startDate: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000
            ).toISOString(),
            endDate: new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ).toISOString(),
            tags: ["Node.js", "JavaScript", "Backend"],
            prerequisites: ["JavaScript ES6+", "Basic server concepts"],
            learningObjectives: [
              "Build REST APIs",
              "Database integration",
              "Authentication",
            ],
            curriculum: [
              {
                module: "Node.js Basics",
                lessons: [
                  {
                    title: "Introduction to Node.js",
                    duration: 45,
                    type: "video" as const,
                  },
                  {
                    title: "Modules and NPM",
                    duration: 60,
                    type: "text" as const,
                  },
                ],
              },
            ],
            createdAt: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setPrograms(mockPrograms);

        // Calculate stats
        const categoryCounts = mockPrograms.reduce((acc: any, p: any) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setStats({
          totalPrograms: mockPrograms.length,
          publishedPrograms: mockPrograms.filter(
            (p: any) => p.status === "published"
          ).length,
          draftPrograms: mockPrograms.filter((p: any) => p.status === "draft")
            .length,
          totalEnrollments: mockPrograms.reduce(
            (acc: any, p: any) => acc + p.enrollmentCount,
            0
          ),
          averageRating:
            mockPrograms.length > 0
              ? mockPrograms.reduce(
                  (acc: any, p: any) => acc + p.averageRating,
                  0
                ) / mockPrograms.length
              : 0,
          totalRevenue: mockPrograms.reduce(
            (acc: any, p: any) => acc + p.price * p.enrollmentCount,
            0
          ),
          monthlyRevenue: mockPrograms
            .filter(
              (p: any) =>
                new Date(p.createdAt) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            )
            .reduce((acc: any, p: any) => acc + p.price * p.enrollmentCount, 0),
          completionRate:
            mockPrograms.length > 0
              ? mockPrograms.reduce(
                  (acc: any, p: any) => acc + p.completionRate,
                  0
                ) / mockPrograms.length
              : 0,
          topCategories: Object.entries(categoryCounts).map(
            ([category, count]) => ({
              category,
              count: count as number,
              revenue: mockPrograms
                .filter((p: any) => p.category === category)
                .reduce(
                  (acc: any, p: any) => acc + p.price * p.enrollmentCount,
                  0
                ),
            })
          ),
          recentEnrollments: mockPrograms
            .filter(
              (p: any) =>
                new Date(p.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
            .reduce((acc: any, p: any) => acc + p.enrollmentCount, 0),
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch training programs");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPrograms();
  }, [userData]);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "all" || program.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || program.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "enrollment":
        comparison = a.enrollmentCount - b.enrollmentCount;
        break;
      case "rating":
        comparison = a.averageRating - b.averageRating;
        break;
      case "revenue":
        comparison = a.price * a.enrollmentCount - b.price * b.enrollmentCount;
        break;
      case "created":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-100 text-gray-700";
      case "paused":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
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
          <p className="text-slate-600">Loading training programs...</p>
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
                Training Programs
              </h1>
              <p className="text-slate-600 text-lg">
                Manage your training programs and track their performance
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/products/new"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Program
              </Link>
              <Link
                href="/dashboard/instructor/analytics"
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.totalPrograms}
                  </h3>
                  <p className="text-slate-600 text-sm">Total Programs</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.totalEnrollments}
                  </h3>
                  <p className="text-slate-600 text-sm">Total Enrollments</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-[12px] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    ${stats.monthlyRevenue?.toLocaleString() || 0}
                  </h3>
                  <p className="text-slate-600 text-sm">Monthly Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-[12px] flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {stats.averageRating?.toFixed(1) || 0}
                  </h3>
                  <p className="text-slate-600 text-sm">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Distribution */}
        {stats?.topCategories && stats.topCategories.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Top Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-[12px]"
                >
                  <span className="text-slate-700 font-medium">
                    {category.category}
                  </span>
                  <span className="text-slate-600 text-sm">
                    {category.count} programs
                  </span>
                </div>
              ))}
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
                  placeholder="Search programs by title, description, or tags..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {stats?.topCategories?.map((category, index) => (
                  <option key={index} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="enrollment">Sort by Enrollments</option>
                <option value="rating">Sort by Rating</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="created">Sort by Created Date</option>
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

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPrograms.length > 0 ? (
            sortedPrograms.map((program) => (
              <div
                key={program._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Program Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {program.thumbnailUrl ? (
                    <img
                      src={program.thumbnailUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        program.status
                      )}`}
                    >
                      {program.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        program.difficulty
                      )}`}
                    >
                      {program.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Program Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {program.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration} hours</span>
                      <span>•</span>
                      <span>{program.category}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {program.enrollmentCount}
                      </div>
                      <div className="text-slate-600 text-sm">Enrollments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">
                        {program.averageRating.toFixed(1)}
                      </div>
                      <div className="text-slate-600 text-sm">Rating</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 text-sm">
                        Sessions Progress
                      </span>
                      <span className="text-slate-700 text-sm font-medium">
                        {program.completedSessions}/{program.totalSessions}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(
                            program.completedSessions,
                            program.totalSessions
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-slate-900">
                      {getCurrencySymbol(program.currency)}
                      {program.price}
                    </div>
                    <div className="text-slate-600 text-sm">
                      {program.currency.toUpperCase()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/products/${program._id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-[12px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      href={`/dashboard/products/${program._id}/edit`}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[12px] hover:bg-slate-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[12px] hover:bg-slate-200 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No training programs found
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ||
                filterStatus !== "all" ||
                filterCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't created any training programs yet"}
              </p>
              <Link
                href="/dashboard/products/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto w-fit"
              >
                <Plus className="w-4 h-4" />
                Create Your First Program
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
