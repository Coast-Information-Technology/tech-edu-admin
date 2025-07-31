import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  User,
  Users,
  BookOpen,
  BarChart3,
  ClipboardList,
  ShieldCheck,
  Layers,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Flag,
  Inbox,
  Bug,
  Award,
  Sparkles,
  Target,
  Zap,
  Calendar,
  Clock,
  Star,
  Eye,
  Heart,
} from "lucide-react";
import {
  adminDashboardMock,
  instructorDashboardMock,
  customerCareDashboardMock,
} from "../mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaCertificate, FaTrophy, FaMedal } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Loader2 } from "lucide-react";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { getUserMe } from "@/lib/apiFetch";
import { useRole } from "@/contexts/RoleContext";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "customerCare", label: "Customer Care" },
];

// Enhanced stat card component with better UX
interface DashboardStatCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tooltip: string;
  focusRingColor?: string;
  gradient?: string;
  showProgress?: boolean;
  progressValue?: number;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
}

function DashboardStatCard({
  href,
  icon,
  title,
  children,
  tooltip,
  focusRingColor = "blue",
  gradient = "from-blue-500 to-blue-600",
  showProgress = false,
  progressValue = 0,
  trend,
}: DashboardStatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={href}
            className="block group"
            tabIndex={0}
            aria-label={title}
            role="link"
          >
            <div
              className={`cursor-pointer focus:ring-2 focus:ring-${focusRingColor}-500 focus:ring-offset-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-lg`}
                    >
                      {icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {title}
                    </CardTitle>
                  </div>
                  {trend && (
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        trend.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trend.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingUp className="w-4 h-4 rotate-180" />
                      )}
                      <span>{trend.value}%</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {children}
                    {showProgress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span className="font-medium">{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </a>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-900 text-white border-gray-700"
        >
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function DashboardOverview() {
  const [userRole, setUserRole] = useState<
    "admin" | "instructor" | "customerCare"
  >("admin");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const { accessToken, isLoading: tokenLoading } = useTokenManagement();
  const router = useRouter();

  // Fetch user fullName
  useEffect(() => {
    if (!accessToken) return;
    getUserMe(accessToken)
      .then((res) => {
        setFullName(res.data?.fullName || "User");
      })
      .catch(() => setFullName("User"));
  }, [accessToken]);

  // Simulate loading when switching roles
  const handleRoleChange = (role: typeof userRole) => {
    setLoading(true);
    setTimeout(() => {
      setUserRole(role);
      setLoading(false);
      router.push(`/dashboard/${role}`);
    }, 700);
  };

  // Branding: logo, platform name, and welcome message
  const platformName = "Tech Eduk";
  const roleDisplay =
    userRole === "admin"
      ? "Admin"
      : userRole === "instructor"
      ? "Instructor"
      : "Customer Care";
  const welcomeMsg = `Welcome, ${fullName || useRole.name}!`;

  return (
    <TooltipProvider>
      <div>
        {/* Enhanced Branding Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl mb-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Enhanced Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border border-white/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {platformName}
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Empowering Education & Innovation
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-lg">{welcomeMsg}</p>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </header>
        {/* Enhanced Role Selector and Demo Mode */}
        <div className="mb-8 flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-blue-600" />
              <label
                htmlFor="role-select"
                className="font-semibold text-gray-700"
                id="role-select-label"
              >
                Dashboard Role:
              </label>
            </div>
            <div className="relative">
              <select
                id="role-select"
                aria-labelledby="role-select-label"
                value={userRole}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="appearance-none bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer hover:border-blue-300"
                disabled={loading}
                aria-label="Select dashboard role"
              >
                {roleOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    aria-label={opt.label}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700 text-sm font-semibold">
                Demo Mode
              </span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                <Loader2
                  className="animate-spin text-blue-600 w-4 h-4"
                  aria-label="Loading"
                />
                <span className="text-blue-700 text-sm font-medium">
                  Loading...
                </span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="animate-spin text-white w-8 h-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-3 h-3 text-yellow-800" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
              Loading Dashboard
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Preparing your personalized dashboard experience...
            </p>
            <div className="mt-6 flex gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            {/* Enhanced Dashboard Content */}
            {userRole === "admin" &&
              (() => {
                const data = adminDashboardMock;
                return (
                  <>
                    {/* Quick Actions */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-blue-600" />
                        Quick Actions
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Users className="w-5 h-5 mr-2" />
                          Manage Users
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Review Courses
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <DollarSign className="w-5 h-5 mr-2" />
                          View Earnings
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Flag className="w-5 h-5 mr-2" />
                          Handle Reports
                        </Button>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Platform Overview
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        <DashboardStatCard
                          href="/dashboard/users"
                          icon={<Users className="w-6 h-6" />}
                          title="Platform Stats"
                          tooltip="View comprehensive platform statistics and user analytics"
                          focusRingColor="blue"
                          gradient="from-blue-500 to-blue-600"
                          trend={{
                            value: 12,
                            isPositive: true,
                            label: "vs last month",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  Total Users
                                </span>
                              </div>
                              <span className="font-bold text-lg text-blue-700">
                                {data.platformStats.totalUsers.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Instructors
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {data.platformStats.instructors.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">
                                  Active Learners
                                </span>
                              </div>
                              <span className="font-bold text-lg text-purple-700">
                                {data.platformStats.activeLearners.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-gray-600">
                                  Completed Courses
                                </span>
                              </div>
                              <span className="font-bold text-lg text-orange-700">
                                {data.platformStats.completedCourses.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/orders"
                          icon={<DollarSign className="w-6 h-6" />}
                          title="Revenue Analytics"
                          tooltip="View detailed earnings, payouts, and financial insights"
                          focusRingColor="green"
                          gradient="from-green-500 to-emerald-600"
                          trend={{
                            value: 8.5,
                            isPositive: true,
                            label: "vs last month",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Total Revenue
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {data.earnings.currency}
                                {data.earnings.total.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">
                                  This Week
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-purple-700">
                                  {data.earnings.currency}
                                  {data.earnings.thisWeek.toLocaleString()}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  +
                                  {(
                                    (data.earnings.thisWeek /
                                      data.earnings.total) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/reports"
                          icon={<AlertTriangle className="w-6 h-6" />}
                          title="Action Required"
                          tooltip="Review and handle pending approvals and flagged content"
                          focusRingColor="orange"
                          gradient="from-orange-500 to-red-600"
                          trend={{
                            value: -15,
                            isPositive: false,
                            label: "vs last week",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-gray-600">
                                  Course Approvals
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-orange-700">
                                  {data.pendingCourseApprovals}
                                </span>
                                <Badge variant="destructive" className="ml-2">
                                  Pending
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Flag className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-600">
                                  Flagged Reviews
                                </span>
                              </div>
                              <span className="font-bold text-lg text-red-700">
                                {data.flaggedReviews}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  Instructor Apps
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-blue-700">
                                  {data.pendingInstructorApplications}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                  Review
                                </Badge>
                              </div>
                            </div>
                            {data.pendingCourseApprovals === 0 &&
                              data.flaggedReviews === 0 &&
                              data.pendingInstructorApplications === 0 && (
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                  <p className="text-green-700 font-medium">
                                    All Clear! 🎉
                                  </p>
                                  <p className="text-green-600 text-sm">
                                    No pending items
                                  </p>
                                </div>
                              )}
                          </div>
                        </DashboardStatCard>
                      </div>
                    </div>

                    {/* Enhanced Analytics Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Analytics & Trends
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                                <BarChart3 className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                Revenue Trends
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Last 6 Weeks
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.earningsChart}>
                                  <defs>
                                    <linearGradient
                                      id="colorEarnings"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                  />
                                  <XAxis
                                    dataKey="week"
                                    stroke="#6b7280"
                                    fontSize={12}
                                  />
                                  <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickFormatter={(value) =>
                                      `$${(value / 1000).toFixed(0)}k`
                                    }
                                  />
                                  <RechartsTooltip
                                    contentStyle={{
                                      backgroundColor: "#1f2937",
                                      border: "none",
                                      borderRadius: "8px",
                                      color: "#f9fafb",
                                    }}
                                    formatter={(value: any) => [
                                      `$${value.toLocaleString()}`,
                                      "Revenue",
                                    ]}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#colorEarnings)"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* User Activity Chart */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                                <Users className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                User Activity
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700"
                            >
                              Real-time
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.earningsChart}>
                                  <defs>
                                    <linearGradient
                                      id="colorUsers"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="5%"
                                        stopColor="#8b5cf6"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor="#8b5cf6"
                                        stopOpacity={0.1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                  />
                                  <XAxis
                                    dataKey="week"
                                    stroke="#6b7280"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#6b7280" fontSize={12} />
                                  <RechartsTooltip
                                    contentStyle={{
                                      backgroundColor: "#1f2937",
                                      border: "none",
                                      borderRadius: "8px",
                                      color: "#f9fafb",
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{
                                      fill: "#8b5cf6",
                                      strokeWidth: 2,
                                      r: 4,
                                    }}
                                    activeDot={{
                                      r: 6,
                                      stroke: "#8b5cf6",
                                      strokeWidth: 2,
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                );
              })()}
            {userRole === "instructor" &&
              (() => {
                const data = instructorDashboardMock;
                return (
                  <>
                    {/* Quick Actions for Instructors */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-blue-600" />
                        Quick Actions
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Create Course
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Users className="w-5 h-5 mr-2" />
                          Manage Students
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <FaCertificate className="w-5 h-5 mr-2" />
                          Issue Certificates
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <DollarSign className="w-5 h-5 mr-2" />
                          View Earnings
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Stats for Instructors */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Teaching Overview
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        <DashboardStatCard
                          href="/dashboard/courses"
                          icon={<BookOpen className="w-6 h-6" />}
                          title="Course Management"
                          tooltip="Manage your courses and view student progress"
                          focusRingColor="blue"
                          gradient="from-blue-500 to-blue-600"
                          trend={{
                            value: 5,
                            isPositive: true,
                            label: "vs last month",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  Active Courses
                                </span>
                              </div>
                              <span className="font-bold text-lg text-blue-700">
                                {data.activeCourses}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Enrolled Students
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {data.enrolledStudents.toLocaleString()}
                              </span>
                            </div>
                            {data.activeCourses === 0 && (
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">
                                  No Active Courses
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Start creating your first course
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/orders"
                          icon={<DollarSign className="w-6 h-6" />}
                          title="Revenue & Earnings"
                          tooltip="Track your earnings and payment history"
                          focusRingColor="green"
                          gradient="from-green-500 to-emerald-600"
                          trend={{
                            value: 12.5,
                            isPositive: true,
                            label: "vs last month",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Total Earnings
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {data.currency}
                                {data.earnings.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">
                                  This Month
                                </span>
                              </div>
                              <span className="font-bold text-lg text-purple-700">
                                {data.currency}
                                {(data.earnings * 0.3).toLocaleString()}
                              </span>
                            </div>
                            {data.earnings === 0 && (
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">
                                  No Earnings Yet
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Start teaching to earn
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/certificates"
                          icon={<FaCertificate className="w-6 h-6" />}
                          title="Certificates & Achievements"
                          tooltip="Manage student certificates and achievements"
                          focusRingColor="yellow"
                          gradient="from-yellow-500 to-orange-600"
                          trend={{
                            value: 8,
                            isPositive: true,
                            label: "vs last month",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-600">
                                  Certificates Issued
                                </span>
                              </div>
                              <span className="font-bold text-lg text-yellow-700">
                                {data.certificatesIssued}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FaTrophy className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-gray-600">
                                  Student Achievements
                                </span>
                              </div>
                              <span className="font-bold text-lg text-orange-700">
                                {Math.floor(data.certificatesIssued * 1.2)}
                              </span>
                            </div>
                            {data.certificatesIssued === 0 && (
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <FaCertificate className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">
                                  No Certificates Yet
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Issue certificates to students
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                      </div>
                    </div>

                    {/* Enhanced Analytics for Instructors */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Student Analytics
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                                <TrendingUp className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                Enrollment Trends
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Last 6 Weeks
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.enrollmentsChart}>
                                  <defs>
                                    <linearGradient
                                      id="colorEnrollments"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                  />
                                  <XAxis
                                    dataKey="week"
                                    stroke="#6b7280"
                                    fontSize={12}
                                  />
                                  <YAxis stroke="#6b7280" fontSize={12} />
                                  <RechartsTooltip
                                    contentStyle={{
                                      backgroundColor: "#1f2937",
                                      border: "none",
                                      borderRadius: "8px",
                                      color: "#f9fafb",
                                    }}
                                    formatter={(value: any) => [
                                      value,
                                      "Enrollments",
                                    ]}
                                  />
                                  <Bar
                                    dataKey="enrollments"
                                    fill="url(#colorEnrollments)"
                                    radius={[4, 4, 0, 0]}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Student Progress Chart */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                                <Users className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                Student Progress
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700"
                            >
                              This Month
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Completed Courses
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Students who finished
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-green-600">
                                  {Math.floor(data.enrolledStudents * 0.15)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Active Learners
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Currently studying
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                  {Math.floor(data.enrolledStudents * 0.65)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Pending Completion
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Need attention
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-orange-600">
                                  {Math.floor(data.enrolledStudents * 0.2)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                );
              })()}
            {userRole === "customerCare" &&
              (() => {
                const data = customerCareDashboardMock;
                return (
                  <>
                    {/* Quick Actions for Customer Care */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-blue-600" />
                        Quick Actions
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Inbox className="w-5 h-5 mr-2" />
                          View Tickets
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Award className="w-5 h-5 mr-2" />
                          Reset Onboarding
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <ShieldCheck className="w-5 h-5 mr-2" />
                          Handle Escalations
                        </Button>
                        <Button className="h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                          <Bug className="w-5 h-5 mr-2" />
                          Bug Reports
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Stats for Customer Care */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Support Overview
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                        <DashboardStatCard
                          href="/dashboard/support-tickets"
                          icon={<Inbox className="w-6 h-6" />}
                          title="Support Tickets"
                          tooltip="Manage and respond to support tickets"
                          focusRingColor="blue"
                          gradient="from-blue-500 to-blue-600"
                          trend={{
                            value: -8,
                            isPositive: false,
                            label: "vs last week",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  Open Tickets
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-blue-700">
                                  {data.openSupportTickets}
                                </span>
                                <Badge variant="destructive" className="ml-2">
                                  Priority
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Resolved Today
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {Math.floor(data.openSupportTickets * 0.3)}
                              </span>
                            </div>
                            {data.openSupportTickets === 0 && (
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-green-700 font-medium">
                                  All Clear! 🎉
                                </p>
                                <p className="text-green-600 text-sm">
                                  No open tickets
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/onboarding"
                          icon={<Award className="w-6 h-6" />}
                          title="Onboarding Support"
                          tooltip="Manage onboarding resets and user guidance"
                          focusRingColor="green"
                          gradient="from-green-500 to-emerald-600"
                          trend={{
                            value: 15,
                            isPositive: true,
                            label: "vs last week",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Resets This Week
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {data.onboardingResetsThisWeek}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">
                                  Users Helped
                                </span>
                              </div>
                              <span className="font-bold text-lg text-blue-700">
                                {data.onboardingResetsThisWeek * 2}
                              </span>
                            </div>
                            {data.onboardingResetsThisWeek === 0 && (
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">
                                  No Resets Needed
                                </p>
                                <p className="text-gray-500 text-sm">
                                  Onboarding is smooth
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/escalations"
                          icon={<AlertTriangle className="w-6 h-6" />}
                          title="Escalations & Issues"
                          tooltip="Handle escalated issues and urgent matters"
                          focusRingColor="orange"
                          gradient="from-orange-500 to-red-600"
                          trend={{
                            value: -12,
                            isPositive: false,
                            label: "vs last week",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-orange-600" />
                                <span className="text-sm text-gray-600">
                                  Last 7 Days
                                </span>
                              </div>
                              <span className="font-bold text-lg text-orange-700">
                                {data.escalationsLast7Days}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-600">
                                  Urgent Issues
                                </span>
                              </div>
                              <span className="font-bold text-lg text-red-700">
                                {Math.floor(data.escalationsLast7Days * 0.4)}
                              </span>
                            </div>
                            {data.escalationsLast7Days === 0 && (
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-green-700 font-medium">
                                  No Escalations
                                </p>
                                <p className="text-green-600 text-sm">
                                  System running smoothly
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                        <DashboardStatCard
                          href="/dashboard/bug-reports"
                          icon={<Bug className="w-6 h-6" />}
                          title="Bug Reports"
                          tooltip="Track and manage bug reports"
                          focusRingColor="red"
                          gradient="from-red-500 to-pink-600"
                          trend={{
                            value: 5,
                            isPositive: true,
                            label: "vs last week",
                          }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-600">
                                  Needing Follow-up
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-lg text-red-700">
                                  {data.bugReportsNeedingFollowup}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                  Follow-up
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  Resolved This Week
                                </span>
                              </div>
                              <span className="font-bold text-lg text-green-700">
                                {Math.floor(
                                  data.bugReportsNeedingFollowup * 0.6
                                )}
                              </span>
                            </div>
                            {data.bugReportsNeedingFollowup === 0 && (
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <Bug className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-green-700 font-medium">
                                  No Bug Reports
                                </p>
                                <p className="text-green-600 text-sm">
                                  System is stable
                                </p>
                              </div>
                            )}
                          </div>
                        </DashboardStatCard>
                      </div>
                    </div>

                    {/* Support Analytics */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        Support Analytics
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                                <Inbox className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                Ticket Volume
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              Last 30 Days
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Inbox className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Total Tickets
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      All time
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                  {data.openSupportTickets * 15}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Resolved
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Successfully closed
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-green-600">
                                  {Math.floor(
                                    data.openSupportTickets * 15 * 0.85
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      Avg Response Time
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Hours to first response
                                    </p>
                                  </div>
                                </div>
                                <span className="text-2xl font-bold text-orange-600">
                                  2.4h
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Customer Satisfaction */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
                          <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                                <Heart className="w-5 h-5" />
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-800">
                                Customer Satisfaction
                              </CardTitle>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-purple-100 text-purple-700"
                            >
                              This Month
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      {
                                        name: "Very Satisfied",
                                        value: 65,
                                        color: "#10b981",
                                      },
                                      {
                                        name: "Satisfied",
                                        value: 25,
                                        color: "#3b82f6",
                                      },
                                      {
                                        name: "Neutral",
                                        value: 8,
                                        color: "#f59e0b",
                                      },
                                      {
                                        name: "Dissatisfied",
                                        value: 2,
                                        color: "#ef4444",
                                      },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                      `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                  >
                                    {[
                                      {
                                        name: "Very Satisfied",
                                        value: 65,
                                        color: "#10b981",
                                      },
                                      {
                                        name: "Satisfied",
                                        value: 25,
                                        color: "#3b82f6",
                                      },
                                      {
                                        name: "Neutral",
                                        value: 8,
                                        color: "#f59e0b",
                                      },
                                      {
                                        name: "Dissatisfied",
                                        value: 2,
                                        color: "#ef4444",
                                      },
                                    ].map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip
                                    contentStyle={{
                                      backgroundColor: "#1f2937",
                                      border: "none",
                                      borderRadius: "8px",
                                      color: "#f9fafb",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                );
              })()}

            {!(
              userRole === "admin" ||
              userRole === "instructor" ||
              userRole === "customerCare"
            ) && <div>No dashboard data available.</div>}
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
