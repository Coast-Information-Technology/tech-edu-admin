"use client";

import {
  BookOpen,
  Users,
  DollarSign,
  Award,
  MessageCircle,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Eye,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
  Zap,
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const instructor = {
  name: "Dr. Sarah Johnson",
  avatar: "/assets/placeholder-avatar.jpg",
  role: "Senior Instructor",
  specialization: "Web Development & React",
};

// Instructor stats data
const stats = [
  {
    icon: <BookOpen size={24} className="text-blue-600" />,
    value: "3",
    label: "Active Courses",
    change: "+1",
    changeType: "positive",
    detail: "Published courses",
  },
  {
    icon: <Users size={24} className="text-green-600" />,
    value: "250",
    label: "Enrolled Students",
    change: "+30",
    changeType: "positive",
    detail: "This week",
  },
  {
    icon: <DollarSign size={24} className="text-purple-600" />,
    value: "₦125K",
    label: "Total Earnings",
    change: "+18%",
    changeType: "positive",
    detail: "This month",
  },
  {
    icon: <Award size={24} className="text-orange-600" />,
    value: "5",
    label: "Certificates Issued",
    change: "+2",
    changeType: "positive",
    detail: "This week",
  },
];

// Enrollment growth data
const enrollmentData = [
  { week: "Week 1", enrollments: 30 },
  { week: "Week 2", enrollments: 40 },
  { week: "Week 3", enrollments: 35 },
  { week: "Week 4", enrollments: 50 },
  { week: "Week 5", enrollments: 45 },
  { week: "Week 6", enrollments: 50 },
];

// Course performance data
const coursePerformanceData = [
  { course: "React Mastery", students: 85, completion: 78, rating: 4.8 },
  { course: "Web Dev Bootcamp", students: 120, completion: 82, rating: 4.9 },
  { course: "Node.js Advanced", students: 45, completion: 65, rating: 4.7 },
];

// Recent reviews
const recentReviews = [
  {
    student: "Alex Thompson",
    course: "React Mastery",
    rating: 5,
    comment: "Excellent course! Sarah explains complex concepts very clearly.",
    date: "2 hours ago",
  },
  {
    student: "Maria Garcia",
    course: "Web Dev Bootcamp",
    rating: 4,
    comment: "Great practical examples and hands-on projects.",
    date: "1 day ago",
  },
  {
    student: "David Chen",
    course: "Node.js Advanced",
    rating: 5,
    comment: "Perfect for advanced developers. Highly recommended!",
    date: "2 days ago",
  },
];

// Quick actions
const quickActions = [
  {
    icon: <Plus size={20} />,
    label: "Create New Course",
    href: "/dashboard/courses-management/create",
    description: "Start building a new course",
    color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "Respond to Reviews",
    href: "/dashboard/feedback",
    description: "Engage with student feedback",
    color: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  {
    icon: <Users size={20} />,
    label: "View Students",
    href: "/dashboard/students",
    description: "Manage enrolled students",
    color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  },
  {
    icon: <BarChart3 size={20} />,
    label: "Analytics",
    href: "/dashboard/performance",
    description: "View detailed analytics",
    color: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  },
  {
    icon: <Award size={20} />,
    label: "Issue Certificates",
    href: "/dashboard/certificates",
    description: "Award course certificates",
    color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  },
  {
    icon: <Calendar size={20} />,
    label: "Schedule Sessions",
    href: "/dashboard/sessions/new",
    description: "Book live sessions",
    color: "bg-pink-50 text-pink-700 hover:bg-pink-100",
  },
];

// Upcoming sessions
const upcomingSessions = [
  {
    title: "React Hooks Deep Dive",
    date: "2024-06-20",
    time: "14:00",
    students: 25,
    duration: "90 min",
  },
  {
    title: "Web Dev Q&A Session",
    date: "2024-06-22",
    time: "16:00",
    students: 18,
    duration: "60 min",
  },
];

export default function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              width={64}
              height={64}
              className="rounded-full border-4 border-[#011F72] shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-[#011F72]">
                Welcome back, {instructor.name}!
              </h1>
              <div className="text-gray-600 mt-1 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-600" />
                {instructor.role} • {instructor.specialization}
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
              Create Course
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
                    vs last week
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Student Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Course Performance */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="students"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
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
              Access all instructor functions and management tools
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

        {/* Recent Reviews & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Reviews */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Recent Student Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#011F72]">
                          {review.student}
                        </p>
                        <p className="text-sm text-gray-600">{review.course}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#011F72]">
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-blue-50 rounded-[10px] p-4 border border-blue-100"
                  >
                    <div>
                      <h3 className="font-semibold text-[#011F72]">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {session.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {session.students} students
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {session.duration}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-[#011F72] hover:bg-blue-700 text-white rounded-[10px]">
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Courses
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline" className="rounded-[10px]">
            <MessageCircle className="w-4 h-4 mr-2" />
            Student Support
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
