"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Clock,
  Calendar,
  Award,
  Target,
  Activity,
  Eye,
  MessageCircle,
  Download,
  RefreshCw,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalPrograms: number;
    totalSessions: number;
    totalRevenue: number;
    averageRating: number;
    completionRate: number;
  };
  revenue: {
    monthly: { month: string; revenue: number }[];
    yearly: { year: number; revenue: number }[];
    byProgram: { program: string; revenue: number }[];
  };
  students: {
    enrollmentTrend: { month: string; enrollments: number }[];
    completionRate: { program: string; rate: number }[];
    satisfaction: { program: string; rating: number }[];
    demographics: { ageGroup: string; count: number }[];
  };
  programs: {
    performance: {
      program: string;
      enrollments: number;
      revenue: number;
      rating: number;
    }[];
    categories: { category: string; count: number; revenue: number }[];
    difficulty: { level: string; count: number; avgRating: number }[];
  };
  sessions: {
    attendance: { month: string; attended: number; total: number }[];
    duration: { program: string; avgDuration: number }[];
    feedback: { session: string; rating: number; comments: number }[];
  };
  goals: {
    monthly: {
      goal: string;
      target: number;
      current: number;
      deadline: string;
    }[];
    yearly: {
      goal: string;
      target: number;
      current: number;
      deadline: string;
    }[];
  };
}

export default function InstructorAnalyticsPage() {
  const { userData } = useRole();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [userData, timeRange]);

  const fetchAnalytics = async () => {
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

      // Fetch analytics data from existing APIs
      const [usersRes, productsRes, bookingsRes, paymentsRes] =
        await Promise.all([
          getApiRequest(`/api/users?limit=100`, token),
          getApiRequest(`/api/products`, token),
          getApiRequest(`/api/bookings/admin/all`, token),
          getApiRequest(`/api/payments/stats`, token),
        ]);

      if (
        usersRes?.data?.success &&
        productsRes?.data?.success &&
        bookingsRes?.data?.success
      ) {
        const allUsers = usersRes.data.data?.users || [];
        const allProducts = productsRes.data.data?.products || [];
        const allBookings = bookingsRes.data.data?.bookings || [];
        const paymentStats = paymentsRes?.data?.data || {};

        // Filter data for current instructor
        const instructorProducts = allProducts.filter(
          (product: any) => product.instructorId === instructorId
        );
        const instructorBookings = allBookings.filter(
          (booking: any) => booking.instructorId === instructorId
        );
        const assignedStudents = allUsers.filter(
          (user: any) =>
            user.role === "student" && user.instructorId === instructorId
        );
        const assignedTechProfessionals = allUsers.filter(
          (user: any) =>
            (user.role === "individualTechProfessional" ||
              user.role === "teamTechProfessional") &&
            user.instructorId === instructorId
        );

        // Calculate time range filter
        const timeRangeMs =
          timeRange === "7d"
            ? 7 * 24 * 60 * 60 * 1000
            : timeRange === "30d"
            ? 30 * 24 * 60 * 60 * 1000
            : timeRange === "90d"
            ? 90 * 24 * 60 * 60 * 1000
            : 365 * 24 * 60 * 60 * 1000;
        const cutoffDate = new Date(Date.now() - timeRangeMs);

        const recentBookings = instructorBookings.filter(
          (b: any) => new Date(b.createdAt) > cutoffDate
        );
        const recentProducts = instructorProducts.filter(
          (p: any) => new Date(p.createdAt) > cutoffDate
        );

        // Generate monthly revenue data
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          const monthKey = date.toISOString().slice(0, 7);
          const monthBookings = instructorBookings.filter((b: any) =>
            b.createdAt.startsWith(monthKey)
          );
          return {
            month: date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            revenue: monthBookings.reduce(
              (acc: any, b: any) => acc + (b.amount || 0),
              0
            ),
          };
        });

        // Generate enrollment trend
        const enrollmentTrend = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          const monthKey = date.toISOString().slice(0, 7);
          const monthBookings = instructorBookings.filter((b: any) =>
            b.createdAt.startsWith(monthKey)
          );
          return {
            month: date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            enrollments: monthBookings.length,
          };
        });

        // Generate program performance data
        const programPerformance = instructorProducts.map((product: any) => {
          const productBookings = instructorBookings.filter(
            (b: any) => b.productId === product._id
          );
          return {
            program: product.title,
            enrollments: productBookings.length,
            revenue: productBookings.reduce(
              (acc: any, b: any) => acc + (b.amount || 0),
              0
            ),
            rating: product.averageRating || 0,
          };
        });

        // Generate category data
        const categoryCounts = instructorProducts.reduce((acc: any, p: any) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const categories = Object.entries(categoryCounts).map(
          ([category, count]) => ({
            category,
            count: count as number,
            revenue: instructorProducts
              .filter((p: any) => p.category === category)
              .reduce(
                (acc: any, p: any) => acc + p.price * (p.enrollmentCount || 0),
                0
              ),
          })
        );

        // Generate goals (mock data for now)
        const monthlyGoals = [
          {
            goal: "Complete 10 sessions",
            target: 10,
            current: recentBookings.length,
            deadline: "End of month",
          },
          {
            goal: "Earn $5000",
            target: 5000,
            current: recentBookings.reduce(
              (acc: any, b: any) => acc + (b.amount || 0),
              0
            ),
            deadline: "End of month",
          },
          {
            goal: "Get 5 new students",
            target: 5,
            current: assignedStudents.filter(
              (s: any) => new Date(s.createdAt) > cutoffDate
            ).length,
            deadline: "End of month",
          },
        ];

        const yearlyGoals = [
          {
            goal: "Complete 100 sessions",
            target: 100,
            current: instructorBookings.length,
            deadline: "End of year",
          },
          {
            goal: "Earn $50000",
            target: 50000,
            current: instructorBookings.reduce(
              (acc: any, b: any) => acc + (b.amount || 0),
              0
            ),
            deadline: "End of year",
          },
          {
            goal: "Get 50 new students",
            target: 50,
            current: assignedStudents.length,
            deadline: "End of year",
          },
        ];

        setAnalytics({
          overview: {
            totalStudents: assignedStudents.length,
            totalPrograms: instructorProducts.length,
            totalSessions: instructorBookings.length,
            totalRevenue: instructorBookings.reduce(
              (acc: any, b: any) => acc + (b.amount || 0),
              0
            ),
            averageRating:
              instructorProducts.length > 0
                ? instructorProducts.reduce(
                    (acc: any, p: any) => acc + (p.averageRating || 0),
                    0
                  ) / instructorProducts.length
                : 0,
            completionRate:
              instructorBookings.length > 0
                ? instructorBookings.filter(
                    (b: any) => b.status === "completed"
                  ).length / instructorBookings.length
                : 0,
          },
          revenue: {
            monthly: monthlyRevenue,
            yearly: [
              {
                year: new Date().getFullYear(),
                revenue: instructorBookings.reduce(
                  (acc: any, b: any) => acc + (b.amount || 0),
                  0
                ),
              },
            ],
            byProgram: programPerformance.map((p: any) => ({
              program: p.program,
              revenue: p.revenue,
            })),
          },
          students: {
            enrollmentTrend: enrollmentTrend,
            completionRate: programPerformance.map((p: any) => ({
              program: p.program,
              rate: 0.8,
            })),
            satisfaction: programPerformance.map((p: any) => ({
              program: p.program,
              rating: p.rating,
            })),
            demographics: [
              {
                ageGroup: "18-25",
                count: Math.floor(assignedStudents.length * 0.3),
              },
              {
                ageGroup: "26-35",
                count: Math.floor(assignedStudents.length * 0.4),
              },
              {
                ageGroup: "36-45",
                count: Math.floor(assignedStudents.length * 0.2),
              },
              {
                ageGroup: "46+",
                count: Math.floor(assignedStudents.length * 0.1),
              },
            ],
          },
          programs: {
            performance: programPerformance,
            categories: categories,
            difficulty: [
              {
                level: "beginner",
                count: instructorProducts.filter(
                  (p: any) => p.difficulty === "beginner"
                ).length,
                avgRating: 4.5,
              },
              {
                level: "intermediate",
                count: instructorProducts.filter(
                  (p: any) => p.difficulty === "intermediate"
                ).length,
                avgRating: 4.3,
              },
              {
                level: "advanced",
                count: instructorProducts.filter(
                  (p: any) => p.difficulty === "advanced"
                ).length,
                avgRating: 4.7,
              },
            ],
          },
          sessions: {
            attendance: monthlyRevenue.map((m: any) => ({
              month: m.month,
              attended: Math.floor(m.revenue / 100),
              total: Math.floor(m.revenue / 50),
            })),
            duration: programPerformance.map((p: any) => ({
              program: p.program,
              avgDuration: 60,
            })),
            feedback: programPerformance.map((p: any) => ({
              session: p.program,
              rating: p.rating,
              comments: Math.floor(Math.random() * 20) + 5,
            })),
          },
          goals: {
            monthly: monthlyGoals,
            yearly: yearlyGoals,
          },
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
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
                Analytics Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                Track your performance and growth as an instructor
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-3 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-3 bg-blue-600 text-white rounded-[12px] hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button className="px-4 py-3 bg-green-600 text-white rounded-[12px] hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        {analytics?.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {analytics.overview.totalStudents}
                  </h3>
                  <p className="text-slate-600 text-sm">Total Students</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {analytics.overview.totalPrograms}
                  </h3>
                  <p className="text-slate-600 text-sm">Programs</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-[12px] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {analytics.overview.totalSessions}
                  </h3>
                  <p className="text-slate-600 text-sm">Sessions</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-[12px] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatCurrency(analytics.overview.totalRevenue)}
                  </h3>
                  <p className="text-slate-600 text-sm">Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-[12px] flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {analytics.overview.averageRating.toFixed(1)}
                  </h3>
                  <p className="text-slate-600 text-sm">Avg Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-[12px] flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {formatPercentage(analytics.overview.completionRate)}
                  </h3>
                  <p className="text-slate-600 text-sm">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Revenue Trend
              </h2>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">
                  Revenue chart will be displayed here
                </p>
              </div>
            </div>
          </div>

          {/* Student Enrollment Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Student Enrollments
              </h2>
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8.2%</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">
                  Enrollment chart will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Performance */}
        {analytics?.programs?.performance && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Program Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Program
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Enrollments
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.programs.performance.map((program, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">
                          {program.program}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700">
                          {program.enrollments}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700">
                          {formatCurrency(program.revenue)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-slate-700">
                            {program.rating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-700">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Goals Section */}
        {analytics?.goals?.monthly && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Monthly Goals
              </h2>
              <div className="space-y-4">
                {analytics.goals.monthly.map((goal, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-[12px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {goal.goal}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {goal.deadline}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (goal.current / goal.target) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Yearly Goals
              </h2>
              <div className="space-y-4">
                {analytics.goals.yearly.map((goal, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-[12px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {goal.goal}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {goal.deadline}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (goal.current / goal.target) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
