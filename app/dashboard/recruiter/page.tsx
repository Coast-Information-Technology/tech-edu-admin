"use client";

import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  User2,
  TrendingUp,
  Calendar,
  ArrowRight,
  Download,
  HelpCircle,
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

const recruiter = {
  name: "Acme Corp",
  avatar: "/assets/logo.png",
};

const stats = [
  {
    icon: <Briefcase size={32} className="text-blue-400 mb-2" />,
    value: 4,
    label: "Jobs Posted",
  },
  {
    icon: <Users size={32} className="text-blue-400 mb-2" />,
    value: 12,
    label: "Applications",
  },
  {
    icon: <FileText size={32} className="text-blue-400 mb-2" />,
    value: 2,
    label: "Upcoming Interviews",
  },
];

const applicationsData = [
  { job: "Frontend Dev", applications: 5 },
  { job: "Backend Dev", applications: 3 },
  { job: "UI/UX Designer", applications: 2 },
  { job: "QA Tester", applications: 2 },
];

const upcomingInterviews = [
  { title: "Frontend Dev", date: "2024-06-21", candidate: "Jane Doe" },
  { title: "Backend Dev", date: "2024-06-22", candidate: "John Smith" },
];

const recentActivity = [
  { type: "job", text: "Posted new job: Backend Dev", date: "2024-06-15" },
  {
    type: "application",
    text: "Received application from Jane Doe",
    date: "2024-06-14",
  },
  {
    type: "interview",
    text: "Scheduled interview for Frontend Dev",
    date: "2024-06-13",
  },
];

const quickLinks = [
  { icon: <PlusCircle size={18} />, label: "Post a Job", href: "#" },
  { icon: <Users size={18} />, label: "View Candidates", href: "#" },
  { icon: <FileText size={18} />, label: "Applications", href: "#" },
];

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Personalized Welcome */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={recruiter.avatar}
            alt={recruiter.name}
            width={56}
            height={56}
            className="rounded-full border-4 border-[#011F72] shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#011F72]">
              Welcome back, {recruiter.name}!
            </h1>
            <div className="text-blue-400 text-sm font-medium mt-1 flex items-center gap-2">
              <TrendingUp size={16} /> "Great teams start with great hires!"
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
        {/* Applications Chart */}
        <div className="bg-white border border-blue-100 rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#011F72] mb-4">
            Applications Per Job
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#011F72"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Upcoming Interviews & Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Interviews */}
          <div className="md:col-span-2 bg-white border border-blue-100 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-[#011F72] mb-4">
              Upcoming Interviews
            </h2>
            {upcomingInterviews.length === 0 ? (
              <div className="text-gray-500">No upcoming interviews!</div>
            ) : (
              <ul className="space-y-3">
                {upcomingInterviews.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-blue-50 rounded-[10px] px-4 py-3 border border-blue-100"
                  >
                    <div>
                      <div className="font-semibold text-[#011F72]">
                        {a.title}
                      </div>
                      <div className="text-xs text-gray-500">{a.candidate}</div>
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
            <PlusCircle size={18} /> Post a Job
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <Users size={18} /> View Candidates
          </button>
          <button className="bg-blue-100 hover:bg-blue-200 text-[#011F72] font-semibold py-2 px-6 rounded-[10px] flex items-center gap-2 transition">
            <FileText size={18} /> Applications
          </button>
        </div>
      </div>
    </div>
  );
}
