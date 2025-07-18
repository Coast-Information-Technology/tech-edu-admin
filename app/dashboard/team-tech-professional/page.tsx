"use client";

import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  ArrowRight,
  Download,
  HelpCircle,
  Video,
  Target,
  Award,
  FileText,
  Briefcase,
  PlusCircle,
  UserCheck,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Image from "next/image";
import Link from "next/link";

// Mock data - replace with real API calls
const teamData = {
  teamName: "Tech Innovators Team",
  teamLead: "Sarah Johnson",
  teamSize: 8,
  company: "TechEdu Solutions",
  avatar: "/assets/placeholder-avatar.jpg",
  logo: "/assets/company-logo.png",
};

const teamStats = [
  {
    icon: <Users size={24} className="text-blue-500" />,
    value: teamData.teamSize,
    label: "Team Members",
    change: "+2 this month",
    color: "blue",
  },
  {
    icon: <BookOpen size={24} className="text-green-500" />,
    value: 12,
    label: "Active Courses",
    change: "3 in progress",
    color: "green",
  },
  {
    icon: <Target size={24} className="text-purple-500" />,
    value: 85,
    label: "Goal Progress",
    change: "+15% this week",
    color: "purple",
  },
  {
    icon: <Award size={24} className="text-orange-500" />,
    value: 24,
    label: "Certifications",
    change: "8 pending",
    color: "orange",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Team Lead",
    avatar: "/assets/placeholder-avatar.jpg",
    progress: 92,
    status: "active",
    lastActive: "2 hours ago",
    skills: ["React", "Node.js", "Leadership"],
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Frontend Developer",
    avatar: "/assets/placeholder-avatar.jpg",
    progress: 78,
    status: "active",
    lastActive: "1 hour ago",
    skills: ["Vue.js", "TypeScript", "UI/UX"],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Backend Developer",
    avatar: "/assets/placeholder-avatar.jpg",
    progress: 85,
    status: "active",
    lastActive: "30 min ago",
    skills: ["Python", "Django", "AWS"],
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps Engineer",
    avatar: "/assets/placeholder-avatar.jpg",
    progress: 65,
    status: "away",
    lastActive: "1 day ago",
    skills: ["Docker", "Kubernetes", "CI/CD"],
  },
];

const learningProgress = [
  { month: "Jan", teamProgress: 45, individualAvg: 52 },
  { month: "Feb", teamProgress: 58, individualAvg: 61 },
  { month: "Mar", teamProgress: 72, individualAvg: 68 },
  { month: "Apr", teamProgress: 78, individualAvg: 75 },
  { month: "May", teamProgress: 85, individualAvg: 82 },
];

const skillDistribution = [
  { name: "Frontend", value: 35, color: "#3B82F6" },
  { name: "Backend", value: 28, color: "#10B981" },
  { name: "DevOps", value: 20, color: "#F59E0B" },
  { name: "Data Science", value: 17, color: "#EF4444" },
];

const upcomingSessions = [
  {
    title: "Advanced React Patterns",
    instructor: "Dr. Maria Santos",
    date: "2024-06-25",
    time: "10:00 AM",
    duration: "2 hours",
    participants: 6,
    type: "workshop",
  },
  {
    title: "Team Code Review Session",
    instructor: "Team Lead",
    date: "2024-06-26",
    time: "2:00 PM",
    duration: "1 hour",
    participants: 8,
    type: "review",
  },
  {
    title: "AWS Cloud Architecture",
    instructor: "John Smith",
    date: "2024-06-28",
    time: "11:00 AM",
    duration: "3 hours",
    participants: 5,
    type: "training",
  },
];

const recentActivities = [
  {
    type: "certification",
    text: "Mike Chen earned React Certification",
    date: "2024-06-15",
    member: "Mike Chen",
    icon: <Award size={16} className="text-green-500" />,
  },
  {
    type: "course",
    text: "Team completed Advanced JavaScript course",
    date: "2024-06-14",
    member: "Team",
    icon: <BookOpen size={16} className="text-blue-500" />,
  },
  {
    type: "assessment",
    text: "Emily Rodriguez passed DevOps assessment",
    date: "2024-06-12",
    member: "Emily Rodriguez",
    icon: <CheckCircle size={16} className="text-purple-500" />,
  },
  {
    type: "goal",
    text: "Team achieved 85% of monthly learning goals",
    date: "2024-06-10",
    member: "Team",
    icon: <Target size={16} className="text-orange-500" />,
  },
];

const quickActions = [
  {
    icon: <PlusCircle size={18} />,
    label: "Add Team Member",
    href: "#",
    color: "blue",
  },
  {
    icon: <BookOpen size={18} />,
    label: "Enroll in Course",
    href: "#",
    color: "green",
  },
  {
    icon: <Target size={18} />,
    label: "Set Team Goals",
    href: "#",
    color: "purple",
  },
  {
    icon: <FileText size={18} />,
    label: "Generate Report",
    href: "#",
    color: "orange",
  },
];

export default function TeamTechProfessionalDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Team Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={28} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {teamData.teamName}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="font-medium">
                      {teamData.teamSize} members
                    </span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span>{teamData.company}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Led by{" "}
                  <span className="font-medium text-gray-700">
                    {teamData.teamLead}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 border border-gray-200">
                <FileText size={16} />
                <span className="hidden sm:inline">Team Report</span>
                <span className="sm:hidden">Report</span>
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Manage Team</span>
                <span className="sm:hidden">Manage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {teamStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Team Members Overview */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
              <Link
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === "active"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {member.role}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.slice(0, 2).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{member.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {member.progress}%
                      </div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${member.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-4 py-3 rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
                >
                  <div className="p-1.5 bg-white rounded-[10px] group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </div>
                  <span className="flex-1">{action.label}</span>
                  <ChevronRight
                    size={16}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Progress Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Team Learning Progress
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="teamProgress"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  name="Team Progress"
                />
                <Line
                  type="monotone"
                  dataKey="individualAvg"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 6,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  name="Individual Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Distribution and Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Team Skills Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Upcoming Sessions
              </h2>
              <Link
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {session.title}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {session.participants} members
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {session.instructor}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {session.time} ({session.duration})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Team Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <div className="flex-shrink-0 p-2 bg-white rounded-[10px] shadow-sm">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 font-medium text-sm sm:text-base">
                    {activity.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.member} • {activity.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Goals Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Team Learning Goals
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors">
              <PlusCircle size={16} /> Add Goal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  Frontend Mastery
                </h3>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  85%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Complete React and Vue.js certifications
              </div>
              <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  DevOps Skills
                </h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  60%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                AWS and Docker implementation
              </div>
              <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  Team Collaboration
                </h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  90%
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Code review and pair programming
              </div>
              <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300"
                  style={{ width: "90%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
