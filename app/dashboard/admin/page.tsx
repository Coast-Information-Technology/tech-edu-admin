"use client";

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

const admin = {
  name: "Admin User",
  avatar: "/assets/placeholder-avatar.jpg",
  role: "System Administrator",
};

// Comprehensive stats data
const stats = [
  {
    icon: <Users size={24} className="text-blue-600" />,
    value: "1,247",
    label: "Total Users",
    change: "+23",
    changeType: "positive",
    detail: "Active accounts",
  },
  {
    icon: <BookOpen size={24} className="text-green-600" />,
    value: "45",
    label: "Active Courses",
    change: "+3",
    changeType: "positive",
    detail: "Published courses",
  },
  {
    icon: <Briefcase size={24} className="text-purple-600" />,
    value: "156",
    label: "Job Postings",
    change: "+12",
    changeType: "positive",
    detail: "Active listings",
  },
  {
    icon: <DollarSign size={24} className="text-orange-600" />,
    value: "₦2.4M",
    label: "Monthly Revenue",
    change: "+18%",
    changeType: "positive",
    detail: "This month",
  },
];

// User growth data
const userGrowthData = [
  { month: "Jan", users: 850, revenue: 1200000 },
  { month: "Feb", users: 920, revenue: 1350000 },
  { month: "Mar", users: 1050, revenue: 1500000 },
  { month: "Apr", users: 1150, revenue: 1650000 },
  { month: "May", users: 1247, revenue: 1800000 },
  { month: "Jun", users: 1350, revenue: 2000000 },
];

// User distribution by role
const userDistributionData = [
  { name: "Students", value: 650, color: "#3B82F6" },
  { name: "Professionals", value: 320, color: "#10B981" },
  { name: "Recruiters", value: 180, color: "#8B5CF6" },
  { name: "Institutions", value: 97, color: "#F59E0B" },
];

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
    label: "Course Management",
    href: "/dashboard/courses-management",
    description: "Create and manage courses",
    color: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  {
    icon: <Briefcase size={20} />,
    label: "Job Management",
    href: "/dashboard/jobs-management",
    description: "Manage job postings",
    color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
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
    href: "/dashboard/orders",
    description: "Manage transactions",
    color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  },
  {
    icon: <Tag size={20} />,
    label: "Promo Codes",
    href: "/dashboard/promo-codes",
    description: "Manage discount codes",
    color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "Feedback / Support",
    href: "/dashboard/feedback",
    description: "Handle user feedback",
    color: "bg-teal-50 text-teal-700 hover:bg-teal-100",
  },
  {
    icon: <HelpCircle size={20} />,
    label: "FAQ Management",
    href: "/dashboard/faqs",
    description: "Manage help articles",
    color: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
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

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              src={admin.avatar}
              alt={admin.name}
              width={64}
              height={64}
              className="rounded-full border-4 border-[#011F72] shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#011F72]">
                Welcome back, {admin.name}!
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Shield size={16} className="text-blue-600" />
                {admin.role} • System Status:{" "}
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle size={12} className="mr-1" />
                  {systemHealth.status}
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4 md:pt-0">
            <Button variant="outline" className="rounded-[10px]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
              <Plus className="w-4 h-4 mr-2" />
              Quick Action
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-[#011F72]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-[10px]">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <Badge
                    className={
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {userDistributionData.map((item, index) => (
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

        {/* Recent Activity & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-[10px]">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#011F72]">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
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
                    {systemHealth.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="font-medium">{systemHealth.uptime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-medium">
                    {systemHealth.activeUsers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Load</span>
                  <span className="font-medium">{systemHealth.serverLoad}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="font-medium">{systemHealth.lastBackup}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <BarChart2 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
