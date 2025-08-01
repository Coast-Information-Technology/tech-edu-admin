"use client";

import {
  MessageCircle,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Plus,
  Download,
  BarChart3,
  Target,
  Zap,
  Phone,
  Mail,
  HelpCircle,
  Shield,
  FileText,
  Settings,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const customerRep = {
  name: "Maria Rodriguez",
  avatar: "/assets/placeholder-avatar.jpg",
  role: "Senior Customer Representative",
  department: "Technical Support",
};

// Customer Representative stats data
const stats = [
  {
    icon: <MessageCircle size={24} className="text-blue-600" />,
    value: "5",
    label: "Open Support Tickets",
    change: "-2",
    changeType: "positive",
    detail: "Resolved today",
  },
  {
    icon: <Users size={24} className="text-green-600" />,
    value: "2",
    label: "Onboarding Resets",
    change: "+1",
    changeType: "neutral",
    detail: "This week",
  },
  {
    icon: <AlertTriangle size={24} className="text-orange-600" />,
    value: "3",
    label: "Escalations",
    change: "-1",
    changeType: "positive",
    detail: "Last 7 days",
  },
  {
    icon: <FileText size={24} className="text-purple-600" />,
    value: "1",
    label: "Bug Reports",
    change: "0",
    changeType: "neutral",
    detail: "Need follow-up",
  },
];

// Support ticket trends data
const ticketTrendsData = [
  { day: "Mon", tickets: 12, resolved: 10 },
  { day: "Tue", tickets: 15, resolved: 13 },
  { day: "Wed", tickets: 8, resolved: 8 },
  { day: "Thu", tickets: 18, resolved: 16 },
  { day: "Fri", tickets: 14, resolved: 12 },
  { day: "Sat", tickets: 6, resolved: 6 },
  { day: "Sun", tickets: 4, resolved: 4 },
];

// Ticket categories distribution
const ticketCategoriesData = [
  { name: "Technical Issues", value: 35, color: "#3B82F6" },
  { name: "Account Access", value: 25, color: "#10B981" },
  { name: "Payment Problems", value: 20, color: "#F59E0B" },
  { name: "Course Access", value: 15, color: "#8B5CF6" },
  { name: "General Inquiries", value: 5, color: "#EF4444" },
];

// Recent support tickets
const recentTickets = [
  {
    id: "TKT-2024-001",
    user: "John Smith",
    issue: "Cannot access React course materials",
    priority: "High",
    status: "In Progress",
    time: "2 hours ago",
    category: "Course Access",
  },
  {
    id: "TKT-2024-002",
    user: "Sarah Johnson",
    issue: "Payment failed for Premium subscription",
    priority: "Medium",
    status: "Resolved",
    time: "4 hours ago",
    category: "Payment Problems",
  },
  {
    id: "TKT-2024-003",
    user: "Mike Davis",
    issue: "Video playback issues on mobile",
    priority: "Low",
    status: "Open",
    time: "6 hours ago",
    category: "Technical Issues",
  },
  {
    id: "TKT-2024-004",
    user: "Lisa Wang",
    issue: "Account verification email not received",
    priority: "Medium",
    status: "In Progress",
    time: "8 hours ago",
    category: "Account Access",
  },
];

// Quick actions
const quickActions = [
  {
    icon: <MessageCircle size={20} />,
    label: "View All Tickets",
    href: "/dashboard/support",
    description: "Manage support tickets",
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: <Users size={20} />,
    label: "User Management",
    href: "/dashboard/users",
    description: "Help with user accounts",
    color: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  {
    icon: <HelpCircle size={20} />,
    label: "FAQ Management",
    href: "/dashboard/faqs",
    description: "Update help articles",
    color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  },
  {
    icon: <FileText size={20} />,
    label: "Bug Reports",
    href: "/dashboard/bug-reports",
    description: "Track and follow up bugs",
    color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  },
  {
    icon: <Settings size={20} />,
    label: "System Settings",
    href: "/dashboard/settings",
    description: "Configure support tools",
    color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  },
  {
    icon: <Download size={20} />,
    label: "Export Reports",
    href: "/dashboard/reports",
    description: "Generate support reports",
    color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
  },
];

// Performance metrics
const performanceMetrics = {
  averageResponseTime: "2.5 hours",
  customerSatisfaction: 4.8,
  ticketsResolvedToday: 15,
  firstCallResolution: "85%",
  averageResolutionTime: "4.2 hours",
};

// Upcoming tasks
const upcomingTasks = [
  {
    title: "Follow up on TKT-2024-001",
    priority: "High",
    due: "Today",
    type: "Ticket Follow-up",
  },
  {
    title: "Update FAQ for payment issues",
    priority: "Medium",
    due: "Tomorrow",
    type: "Content Update",
  },
  {
    title: "Weekly support report",
    priority: "Low",
    due: "Friday",
    type: "Reporting",
  },
];

export default function CustomerRepresentativeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              src={customerRep.avatar}
              alt={customerRep.name}
              width={64}
              height={64}
              className="rounded-full border-4 border-[#011F72] shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#011F72]">
                Welcome back, {customerRep.name}!
              </h1>
              <div className="text-gray-600 mt-1 flex items-center gap-2">
                <MessageCircle size={16} className="text-blue-600" />
                {customerRep.role} • {customerRep.department}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 md:pt-0">
            <Button variant="outline" className="rounded-[10px]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
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
                        : stat.changeType === "negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500 ml-2">
                    vs yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Trends Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Support Ticket Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="New Tickets"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ticket Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Ticket Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {ticketCategoriesData.map((item, index) => (
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
                    <span className="font-medium">{item.value}%</span>
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
              Access all customer support functions and tools
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

        {/* Recent Tickets & Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Support Tickets */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Recent Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#011F72]">
                          {ticket.id} - {ticket.user}
                        </p>
                        <p className="text-sm text-gray-600">{ticket.issue}</p>
                        <p className="text-xs text-gray-500">
                          {ticket.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={
                            ticket.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                        <Badge
                          className={
                            ticket.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{ticket.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Response Time
                  </span>
                  <span className="font-medium">
                    {performanceMetrics.averageResponseTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Customer Satisfaction
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {performanceMetrics.customerSatisfaction}
                    </span>
                    <Star size={14} className="text-yellow-400 fill-current" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Tickets Resolved Today
                  </span>
                  <span className="font-medium">
                    {performanceMetrics.ticketsResolvedToday}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    First Call Resolution
                  </span>
                  <span className="font-medium">
                    {performanceMetrics.firstCallResolution}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Resolution Time
                  </span>
                  <span className="font-medium">
                    {performanceMetrics.averageResolutionTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#011F72]">
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-blue-50 rounded-[10px] p-4 border border-blue-100"
                >
                  <div>
                    <h3 className="font-semibold text-[#011F72]">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{task.type}</p>
                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                  </div>
                  <Badge
                    className={
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
            <MessageCircle className="w-4 h-4 mr-2" />
            View All Tickets
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance Report
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <HelpCircle className="w-4 h-4 mr-2" />
            Manage FAQs
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}
