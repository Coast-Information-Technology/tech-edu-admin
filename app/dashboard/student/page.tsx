"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  BookOpen,
  FileText,
  PlusCircle,
  User2,
  Calendar,
  ArrowRight,
  Download,
  HelpCircle,
  Video,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";
import { getUserMe, getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
}

const stats = [
  {
    icon: <GraduationCap size={32} className="text-blue-400 mb-2" />,
    value: 3,
    label: "Courses Enrolled",
  },
  {
    icon: <BookOpen size={32} className="text-blue-400 mb-2" />,
    value: 5,
    label: "Assignments",
  },
  {
    icon: <FileText size={32} className="text-blue-400 mb-2" />,
    value: 2,
    label: "Job Applications",
  },
];

const assignmentsData = [
  { month: "Jan", completed: 2 },
  { month: "Feb", completed: 3 },
  { month: "Mar", completed: 1 },
  { month: "Apr", completed: 4 },
  { month: "May", completed: 2 },
];

const upcomingAssignments = [
  { title: "React Project", due: "2024-06-20", course: "Frontend Dev" },
  { title: "Database Quiz", due: "2024-06-22", course: "Databases 101" },
];

const recentActivity = [
  {
    type: "assignment",
    text: "Submitted Assignment 2 for Frontend Dev",
    date: "2024-06-15",
  },
  {
    type: "application",
    text: "Applied for Frontend Internship at TechEdu",
    date: "2024-06-14",
  },
  { type: "course", text: "Enrolled in Databases 101", date: "2024-06-10" },
];

const quickLinks = [
  { icon: <Video size={18} />, label: "Join Live Class", href: "#" },
  { icon: <Download size={18} />, label: "Download Certificate", href: "#" },
  { icon: <HelpCircle size={18} />, label: "Contact Support", href: "#" },
];

const courseProgress = 0.65; // 65% complete

export default function StudentDashboard() {
  // Remove all userData, loading, error, and fetch logic

  // Show only the static dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Personalized Welcome */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/assets/placeholder-avatar.jpg"
            alt="Student Name"
            width={56}
            height={56}
            className="rounded-full border-4 border-[#011F72] shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#011F72]">
              Welcome back, Student!
            </h1>
            <div className="text-blue-400 text-sm font-medium mt-1 flex items-center gap-2">
              <TrendingUp size={16} /> "Keep pushing forward—your future is
              bright!"
            </div>
            {/* <div className="text-orange-600 text-sm mt-1 flex items-center gap-1">
              ⚠️ Please verify your email address
            </div> */}
          </div>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition"
            >
              {stat.icon}
              <div className="text-2xl font-bold text-[#011F72]">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#011F72] font-semibold">
              Course Progress
            </span>
            <span className="text-blue-400 font-medium">
              {Math.round(courseProgress * 100)}%
            </span>
          </div>
          <div className="w-full h-4 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#011F72] to-blue-400 transition-all"
              style={{ width: `${courseProgress * 100}%` }}
            />
          </div>
        </div>
        {/* Sample Chart */}
        <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Assignments Completed Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assignmentsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="completed" fill="#011F72" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Upcoming Assignments & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Assignments */}
          <div className="md:col-span-2 bg-white border border-blue-100 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Upcoming Assignments
            </h2>
            {upcomingAssignments.length === 0 ? (
              <div className="text-gray-500">No upcoming assignments!</div>
            ) : (
              <ul className="space-y-3">
                {upcomingAssignments.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-blue-50 rounded-[10px] px-4 py-3 border border-blue-100"
                  >
                    <div>
                      <div className="font-semibold text-[#011F72]">
                        {a.title}
                      </div>
                      <div className="text-xs text-gray-500">{a.course}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-sm text-blue-700 font-medium">
                        Due {a.due}
                      </span>
                      <button className="ml-2 text-blue-400 hover:text-[#011F72] font-semibold flex items-center gap-1 text-xs">
                        View <ArrowRight size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Quick Links */}
          <div className="bg-white border border-blue-100 rounded-xl shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Quick Links
            </h2>
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#011F72] font-medium px-4 py-2 rounded-[10px] transition"
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>
        </div>
        {/* Recent Activity Feed */}
        <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Recent Activity
          </h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[#011F72] font-medium">
                  {activity.text}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {activity.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Main Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#011F72] hover:bg-blue-400 text-white font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <PlusCircle size={18} /> Start New Course
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <BookOpen size={18} /> View Assignments
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <FileText size={18} /> My Applications
          </button>
        </div>
      </div>
    </div>
  );
}
