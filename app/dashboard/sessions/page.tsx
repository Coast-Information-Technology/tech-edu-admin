"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowRight,
  BookOpen,
  Calendar,
  Video,
  Settings,
  Clock,
  Plus,
  BarChart3,
  FileText,
  CheckCircle,
  Star,
} from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Session Management
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and monitor all sessions across the platform
            </p>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Create New Session */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Create Session
              </h2>
              <p className="text-slate-600">
                Schedule new 1-on-1 or group sessions
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Schedule individual mentoring sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Users className="w-4 h-4 text-green-500" />
                <span>Organize group training sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Settings className="w-4 h-4 text-purple-500" />
                <span>Set session details and requirements</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard/sessions/new")}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                Create New Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Manage Sessions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Manage Sessions
              </h2>
              <p className="text-slate-600">
                View and manage all active sessions
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span>View all scheduled sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Video className="w-4 h-4 text-blue-500" />
                <span>Update session details and notes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Track session completion status</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard/sessions/instructor")}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                Manage Sessions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Session Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Session Analytics
              </h2>
              <p className="text-slate-600">
                Monitor session performance and insights
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>View session completion rates</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Generate session reports</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Track session duration trends</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard/sessions/analytics")}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                View Analytics
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">24</h3>
            <p className="text-slate-600 text-sm">Active Sessions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">156</h3>
            <p className="text-slate-600 text-sm">Completed Today</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">8</h3>
            <p className="text-slate-600 text-sm">Upcoming Today</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">4.8</h3>
            <p className="text-slate-600 text-sm">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
