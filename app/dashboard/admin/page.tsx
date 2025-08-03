"use client";

import React, { useState, useEffect } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { useTokenManagement } from "@/hooks/useTokenManagement";
import { toast } from "react-toastify";
import {
  Users,
  Briefcase,
  BarChart2,
  Settings,
  TrendingUp,
  BookOpen,
  FileText,
  ShoppingCart,
  Tag,
  MessageCircle,
  HelpCircle,
  Shield,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Clock,
  Target,
  Building2,
  GraduationCap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

// Data interfaces
interface UserStats {
  total: number;
  byRole: {
    student: number;
    individualTechProfessional: number;
    teamTechProfessional: number;
    recruiter: number;
    institution: number;
    customerCareRepresentative: number;
    instructor: number;
    admin: number;
  };
  verified: number;
  locked: number;
  active: number;
}

interface OnboardingStats {
  totalUsers: number;
  completedOnboarding: number;
  inProgressOnboarding: number;
  abandonedOnboarding: number;
  averageCompletionTime: number;
  stepCompletionRates: {
    student: Record<string, number>;
    techProfessional: Record<string, number>;
  };
  userTypeBreakdown: {
    student: number;
    techProfessional: number;
    recruiter: number;
    institution: number;
    admin: number;
    customerCareRepresentative: number;
  };
}

interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalAmount: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [onboardingStats, setOnboardingStats] =
    useState<OnboardingStats | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  const { accessToken, isLoading: tokenLoading } = useTokenManagement();

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!accessToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);

      // Fetch users data
      const usersResponse = await getApiRequest(
        "/api/users?limit=100",
        accessToken
      );
      if (usersResponse.status === 200) {
        const users = usersResponse.data?.data?.data?.users || [];
        const total = usersResponse.data?.data?.data?.total || 0;

        // Calculate user statistics
        const byRole = {
          student: users.filter((u: any) => u.role === "student").length,
          individualTechProfessional: users.filter(
            (u: any) => u.role === "individualTechProfessional"
          ).length,
          teamTechProfessional: users.filter(
            (u: any) => u.role === "teamTechProfessional"
          ).length,
          recruiter: users.filter((u: any) => u.role === "recruiter").length,
          institution: users.filter((u: any) => u.role === "institution")
            .length,
          customerCareRepresentative: users.filter(
            (u: any) => u.role === "customerCareRepresentative"
          ).length,
          instructor: users.filter((u: any) => u.role === "instructor").length,
          admin: users.filter((u: any) => u.role === "admin").length,
        };

        const verified = users.filter((u: any) => u.isVerified).length;
        const locked = users.filter((u: any) => u.isLocked).length;
        const active = users.filter((u: any) => !u.isLocked).length;

        setUserStats({
          total,
          byRole,
          verified,
          locked,
          active,
        });

        // Get recent users (last 5)
        setRecentUsers(users.slice(0, 5));
      }

      // Fetch onboarding analytics
      const onboardingResponse = await getApiRequest(
        "/api/onboarding/analytics",
        accessToken
      );
      if (onboardingResponse.status === 200) {
        // Map the response to match our interface
        const analyticsData =
          onboardingResponse.data?.data || onboardingResponse.data;
        setOnboardingStats({
          totalUsers: analyticsData.totalUsers || 0,
          completedOnboarding: analyticsData.completedUsers || 0,
          inProgressOnboarding: analyticsData.inProgressUsers || 0,
          abandonedOnboarding: analyticsData.stuckUsers || 0,
          averageCompletionTime: 24, // Default value
          stepCompletionRates: {
            student: {},
            techProfessional: {},
          },
          userTypeBreakdown: {
            student: 0,
            techProfessional: 0,
            recruiter: 0,
            institution: 0,
            admin: 0,
            customerCareRepresentative: 0,
          },
        });
      }

      // Fetch payment statistics
      const paymentResponse = await getApiRequest(
        "/api/payments/stats",
        accessToken
      );
      if (paymentResponse.status === 200) {
        setPaymentStats(paymentResponse.data?.data);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenLoading && accessToken) {
      fetchDashboardData();
    }
  }, [accessToken, tokenLoading]);

  // Loading state
  if (loading || tokenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // User growth data
  const userGrowthData = [
    { month: "Jan", users: 850, revenue: 1200000 },
    { month: "Feb", users: 920, revenue: 1350000 },
    { month: "Mar", users: 1050, revenue: 1500000 },
    { month: "Apr", users: 1150, revenue: 1650000 },
    { month: "May", users: 1247, revenue: 1800000 },
    { month: "Jun", users: 1350, revenue: 2000000 },
  ];

  // User distribution by role - will be populated with real data
  const getUserDistributionData = (userStats: UserStats | null) => {
    if (!userStats) return [];

    return [
      { name: "Students", value: userStats.byRole.student, color: "#3B82F6" },
      {
        name: "Tech Professionals",
        value:
          userStats.byRole.individualTechProfessional +
          userStats.byRole.teamTechProfessional,
        color: "#10B981",
      },
      {
        name: "Recruiters",
        value: userStats.byRole.recruiter,
        color: "#8B5CF6",
      },
      {
        name: "Institutions",
        value: userStats.byRole.institution,
        color: "#F59E0B",
      },
      {
        name: "Instructors",
        value: userStats.byRole.instructor,
        color: "#EF4444",
      },
      {
        name: "Customer Care Representatives",
        value: userStats.byRole.customerCareRepresentative,
        color: "#6B7280",
      },
      { name: "Admins", value: userStats.byRole.admin, color: "#6B7280" },
    ].filter((item) => item.value > 0);
  };

  // Recent activity
  const recentActivity = [
    {
      type: "user",
      text: "New user registration: Sarah Johnson",
      date: "2 minutes ago",
      icon: <Users size={16} className="text-blue-600" />,
    },
    {
      type: "course",
      text: "Course published: Advanced React Development",
      date: "15 minutes ago",
      icon: <BookOpen size={16} className="text-green-600" />,
    },
    {
      type: "job",
      text: "Job posting approved: Senior Frontend Developer",
      date: "1 hour ago",
      icon: <Briefcase size={16} className="text-purple-600" />,
    },
    {
      type: "payment",
      text: "Payment processed: ₦150,000 for Premium Course",
      date: "2 hours ago",
      icon: <DollarSign size={16} className="text-orange-600" />,
    },
    {
      type: "support",
      text: "Support ticket resolved: #TKT-2024-001",
      date: "3 hours ago",
      icon: <MessageCircle size={16} className="text-indigo-600" />,
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: <Users size={20} />,
      label: "User Management",
      href: "/dashboard/users",
      description: "Manage all user accounts",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Products & Services",
      href: "/dashboard/products-management",
      description: "Create and manage products",
      color: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      icon: <FileText size={20} />,
      label: "CVs / Profiles",
      href: "/dashboard/cvs",
      description: "View user profiles and CVs",
      color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "Orders / Payments",
      href: "/dashboard/payments",
      description: "Manage transactions",
      color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    },
    {
      icon: <MessageCircle size={20} />,
      label: "Feedback / Support",
      href: "/dashboard/feedback",
      description: "Handle user feedback",
      color: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    },
    {
      icon: <Settings size={20} />,
      label: "Site Settings",
      href: "/dashboard/settings",
      description: "Configure system settings",
      color: "bg-gray-50 text-gray-700 hover:bg-gray-100",
    },
  ];

  // System health indicators
  const systemHealth = {
    status: "Healthy",
    uptime: "99.9%",
    lastBackup: "2 hours ago",
    activeUsers: 847,
    serverLoad: "23%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              src="/assets/placeholder-avatar.jpg"
              alt="Admin User"
              width={64}
              height={64}
              className="rounded-full border-4 border-[#011F72] shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#011F72]">
                Welcome back, Admin!
              </h1>
              <div className="text-gray-600 mt-1 flex flex-col lg:flex-row items-start gap-2">
                <span className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  System Administrator
                </span>
                <Badge className="bg-green-100 text-green-800">
                  System Status: Healthy{" "}
                  <CheckCircle size={12} className="mr-1" />
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-3 pt-4 md:pt-0">
            <Button
              variant="outline"
              className="rounded-[10px]"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-[#011F72]">
                    {userStats?.total?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Active accounts</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-[10px]">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Badge className="bg-green-100 text-green-800">
                  +{userStats?.active || 0}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">active users</span>
              </div>
            </CardContent>
          </Card>

          {/* Verified Users */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Verified Users
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {userStats?.verified?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Email verified</p>
                </div>
                <div className="p-3 bg-green-50 rounded-[10px]">
                  <UserCheck size={24} className="text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {userStats?.total
                    ? Math.round((userStats.verified / userStats.total) * 100)
                    : 0}
                  %
                </Badge>
                <span className="text-xs text-gray-500 ml-2">
                  verification rate
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Completion */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Onboarding Complete
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {onboardingStats?.completedOnboarding?.toLocaleString() ||
                      "0"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Profiles completed
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-[10px]">
                  <CheckCircle size={24} className="text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Badge className="bg-yellow-100 text-yellow-800">
                  {onboardingStats?.averageCompletionTime || 0}h
                </Badge>
                <span className="text-xs text-gray-500 ml-2">
                  avg completion time
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₦{(paymentStats?.totalAmount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-[10px]">
                  <DollarSign size={24} className="text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-3">
                <Badge className="bg-green-100 text-green-800">
                  {paymentStats?.successfulPayments || 0}
                </Badge>
                <span className="text-xs text-gray-500 ml-2">
                  successful payments
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                User Growth & Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="Users"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="Revenue (₦)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                User Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getUserDistributionData(userStats)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getUserDistributionData(userStats).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {getUserDistributionData(userStats).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#011F72]">
              Quick Actions
            </CardTitle>
            <p className="text-gray-600">
              Access all admin functions and management tools
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-[10px] ${action.color}`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#011F72]">
                            {action.label}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-[10px]">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#011F72]">
                        {user.fullName} ({user.role})
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email} •{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge
                          variant={user.isVerified ? "default" : "secondary"}
                          className={`text-xs ${
                            user.isVerified
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
                        </Badge>
                        <Badge
                          variant={user.isLocked ? "destructive" : "default"}
                          className={`text-xs ${
                            user.isLocked
                              ? "bg-red-100 text-red-600 border-red-200"
                              : "bg-green-100 text-green-600 border-green-200"
                          }`}
                        >
                          {user.isLocked ? "Locked" : "Active"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-medium">{userStats?.active || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Onboarding Rate</span>
                  <span className="font-medium">
                    {onboardingStats?.totalUsers
                      ? Math.round(
                          (onboardingStats.completedOnboarding /
                            onboardingStats.totalUsers) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Payment Success Rate
                  </span>
                  <span className="font-medium">
                    {paymentStats?.totalPayments
                      ? Math.round(
                          (paymentStats.successfulPayments /
                            paymentStats.totalPayments) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Onboarding Time
                  </span>
                  <span className="font-medium">
                    {onboardingStats?.averageCompletionTime || 0}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]"
            asChild
          >
            <Link href="/dashboard/users">
              <Users className="w-4 h-4 mr-2" />
              Manage Users ({userStats?.total || 0})
            </Link>
          </Button>
          <Button variant="outline" className="rounded-[10px]" asChild>
            <Link href="/dashboard/payments">
              <BarChart2 className="w-4 h-4 mr-2" />
              View Payments ({paymentStats?.totalPayments || 0})
            </Link>
          </Button>
          <Button variant="outline" className="rounded-[10px]" asChild>
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-[10px]"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
