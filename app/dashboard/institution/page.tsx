"use client";

import {
  Users,
  BookOpen,
  Handshake,
  PlusCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Image from "next/image";

const institution = {
  name: "Global University",
  avatar: "/assets/logo.png",
};

const stats = [
  {
    icon: <Users size={32} className="text-blue-400 mb-2" />,
    value: 120,
    label: "Students",
  },
  {
    icon: <BookOpen size={32} className="text-blue-400 mb-2" />,
    value: 10,
    label: "Courses",
  },
  {
    icon: <Handshake size={32} className="text-blue-400 mb-2" />,
    value: 5,
    label: "Partnerships",
  },
];

const studentGrowthData = [
  { month: "Jan", students: 80 },
  { month: "Feb", students: 90 },
  { month: "Mar", students: 100 },
  { month: "Apr", students: 110 },
  { month: "May", students: 120 },
];

const upcomingPartnerships = [
  { name: "TechEdu Solutions", date: "2024-06-25" },
  { name: "InnovateX", date: "2024-07-01" },
];

const recentActivity = [
  {
    type: "course",
    text: "Added new course: Data Science 101",
    date: "2024-06-15",
  },
  {
    type: "partnership",
    text: "Formed partnership with TechEdu Solutions",
    date: "2024-06-14",
  },
  { type: "student", text: "Enrolled 10 new students", date: "2024-06-10" },
];

const quickLinks = [
  { icon: <PlusCircle size={18} />, label: "Add Course", href: "#" },
  { icon: <Users size={18} />, label: "View Students", href: "#" },
  { icon: <Handshake size={18} />, label: "Partnerships", href: "#" },
];

export default function InstitutionDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Personalized Welcome */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={institution.avatar}
            alt={institution.name}
            width={56}
            height={56}
            className="rounded-full border-4 border-[#011F72] shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#011F72]">
              Welcome back, {institution.name}!
            </h1>
            <div className="text-blue-400 text-sm font-medium mt-1 flex items-center gap-2">
              <TrendingUp size={16} /> "Empowering students, building futures!"
            </div>
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
        {/* Student Growth Chart */}
        <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Student Growth Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#011F72"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Upcoming Partnerships & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Partnerships */}
          <div className="md:col-span-2 bg-white border border-blue-100 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Upcoming Partnerships
            </h2>
            {upcomingPartnerships.length === 0 ? (
              <div className="text-gray-500">No upcoming partnerships!</div>
            ) : (
              <ul className="space-y-3">
                {upcomingPartnerships.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-blue-50 rounded-[10px] px-4 py-3 border border-blue-100"
                  >
                    <div>
                      <div className="font-semibold text-[#011F72]">
                        {a.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-sm text-blue-700 font-medium">
                        {a.date}
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
            <PlusCircle size={18} /> Add Course
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <Users size={18} /> View Students
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <Handshake size={18} /> Partnerships
          </button>
        </div>
      </div>
    </div>
  );
}
