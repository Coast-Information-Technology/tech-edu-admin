"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  ArrowRight,
  BookOpen,
  Calendar,
  Video,
  Settings,
  Clock,
} from "lucide-react";

export default function SessionsPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<
    "instructor" | "student" | null
  >(null);

  const handleRoleSelect = (role: "instructor" | "student") => {
    setSelectedRole(role);
    if (role === "instructor") {
      router.push("/dashboard/sessions/instructor");
    } else {
      router.push("/dashboard/sessions/student");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Sessions
            </h1>
            <p className="text-slate-600 text-lg">
              Choose your role to access the appropriate session management
              interface
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Instructor Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Instructor
              </h2>
              <p className="text-slate-600">
                Manage your individual and group sessions
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Schedule and manage 1-on-1 sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Users className="w-4 h-4 text-green-500" />
                <span>Handle group training sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Settings className="w-4 h-4 text-purple-500" />
                <span>Update session details and notes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Track session completion and ratings</span>
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect("instructor")}
              disabled={selectedRole !== null}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                Access Instructor Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Student Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Student
              </h2>
              <p className="text-slate-600">
                View and join your scheduled sessions
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span>View your scheduled sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Video className="w-4 h-4 text-blue-500" />
                <span>Join 1-on-1 mentoring sessions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Track session schedules and progress</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Settings className="w-4 h-4 text-orange-500" />
                <span>Access session materials and notes</span>
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect("student")}
              disabled={selectedRole !== null}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                Access Student Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Create Session
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Schedule a new 1-on-1 or group session
              </p>
              <button
                onClick={() => router.push("/dashboard/sessions/new")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
              >
                Get Started →
              </button>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Join Session
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Access your scheduled sessions
              </p>
              <button
                onClick={() => router.push("/dashboard/sessions/student")}
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-300"
              >
                View Sessions →
              </button>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Manage Sessions
              </h4>
              <p className="text-sm text-slate-600 mb-4">
                Edit and organize your sessions
              </p>
              <button
                onClick={() => router.push("/dashboard/sessions/instructor")}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-300"
              >
                Manage Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
