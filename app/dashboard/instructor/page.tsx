"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  UserCheck,
  BarChart3,
  Settings,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface InstructorProfile {
  _id: string;
  fullName: string;
  email: string;
  title: string;
  bio: string;
  specializationAreas: string[];
  yearsOfExperience: number;
  certifications: string[];
  rating: number;
  reviews: number;
  profilePicture?: string;
  linkedInProfileUrl?: string;
  languagesSpoken: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InstructorStats {
  totalStudents: number;
  assignStudents: number;
  assignTechProfessionals: number;
  trainingProgramsHandled: string[];
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  averageRating: number;
  totalReviews: number;
  totalEarnings: number;
  monthlyEarnings: number;
  availabilityHours: number;
  lastActive: string;
}

interface RecentActivity {
  id: string;
  type: "session" | "student" | "program" | "rating";
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "upcoming" | "pending";
}

export default function InstructorDashboard() {
  const { userData } = useRole();
  const router = useRouter();
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);
        const token = getTokenFromCookies();
        if (!token) {
          router.push("/login");
          return;
        }

        const instructorId = userData._id || userData.id;
        if (!instructorId) {
          setError("Instructor ID not found.");
          return;
        }

        // Fetch instructor profile and stats from available APIs
        const [profileRes, sessionsRes, classroomsRes] = await Promise.all([
          getApiRequest(`/api/users/me`, token),
          getApiRequest(`/api/sessions/instructor/my-sessions`, token),
          getApiRequest(`/api/classrooms/instructor/my-classrooms`, token),
        ]);

        // Set instructor profile from user data
        if (profileRes?.data?.success) {
          const profileData = profileRes.data.data;
          setProfile({
            _id: profileData._id || userData._id,
            fullName: profileData.fullName || userData.fullName,
            email: profileData.email || userData.email,
            title: profileData.title || "Instructor",
            bio: profileData.bio || "Experienced instructor",
            specializationAreas: profileData.specializationAreas || [],
            yearsOfExperience: profileData.yearsOfExperience || 0,
            certifications: profileData.certifications || [],
            rating: profileData.rating || 4.5,
            reviews: profileData.reviews || 0,
            profilePicture: profileData.profilePicture,
            linkedInProfileUrl: profileData.linkedInProfileUrl,
            languagesSpoken: profileData.languagesSpoken || [],
            isActive: profileData.isActive || true,
            createdAt: profileData.createdAt,
            updatedAt: profileData.updatedAt,
          });
        }

        // Calculate stats from available data
        const sessions = sessionsRes?.data?.data || [];
        const classrooms = classroomsRes?.data?.data || [];

        // Calculate basic stats from available data
        const completedSessions = sessions.filter(
          (s: any) => s.status === "completed"
        ).length;
        const upcomingSessions = sessions.filter(
          (s: any) => s.status === "scheduled"
        ).length;

        setStats({
          totalStudents: 0, // Will be updated when student assignment API is available
          assignStudents: 0,
          assignTechProfessionals: 0,
          trainingProgramsHandled: classrooms.map((c: any) => c.name),
          totalSessions: sessions.length,
          completedSessions,
          upcomingSessions,
          averageRating: 4.5, // Default value
          totalReviews: 0,
          totalEarnings: 0, // Will be calculated when payment data is available
          monthlyEarnings: 0,
          availabilityHours: 40, // Default value
          lastActive: new Date().toISOString(),
        });

        // Generate recent activity from sessions
        const recentSessions = sessions
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt || b.scheduleAt).getTime() -
              new Date(a.createdAt || a.scheduleAt).getTime()
          )
          .slice(0, 5)
          .map((session: any) => ({
            id: session._id,
            type: "session" as const,
            title: `Session: ${
              session.title || session.name || "Class Session"
            }`,
            description: `Scheduled for ${new Date(
              session.scheduleAt || session.createdAt
            ).toLocaleDateString()}`,
            timestamp: new Date(
              session.createdAt || session.scheduleAt
            ).toLocaleDateString(),
            status:
              session.status === "completed"
                ? ("completed" as const)
                : session.status === "scheduled"
                ? ("upcoming" as const)
                : ("pending" as const),
          }));

        setRecentActivity(recentSessions);
      } catch (err: any) {
        setError(err.message || "Failed to fetch instructor data");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {profile?.fullName?.charAt(0) || "I"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Welcome back, {profile?.fullName || "Instructor"}!
                </h1>
                <p className="text-slate-600 text-lg">{profile?.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-slate-700 font-semibold">
                      {stats?.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-slate-500">
                      ({stats?.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-700">
                      {profile?.yearsOfExperience || 0} years experience
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {/* <Link
                href="/dashboard/instructor/profile"
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </Link> */}
              <Link
                href="/dashboard/instructor-availability"
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Manage Availability
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats?.totalStudents || 0}
            </h3>
            <p className="text-slate-600 text-sm">Total Students</p>
            <Link
              href="/dashboard/instructor/students"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2 inline-flex items-center gap-1"
            >
              View all <Eye className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-[12px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats?.assignStudents || 0}
            </h3>
            <p className="text-slate-600 text-sm">Assigned Students</p>
            <Link
              href="/dashboard/instructor/assigned-students"
              className="text-green-600 text-sm font-medium hover:text-green-700 mt-2 inline-flex items-center gap-1"
            >
              Manage <Settings className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-[12px] flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats?.assignTechProfessionals || 0}
            </h3>
            <p className="text-slate-600 text-sm">Tech Professionals</p>
            <Link
              href="/dashboard/instructor/tech-professionals"
              className="text-purple-600 text-sm font-medium hover:text-purple-700 mt-2 inline-flex items-center gap-1"
            >
              View all <Eye className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-[12px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">
              {stats?.trainingProgramsHandled?.length || 0}
            </h3>
            <p className="text-slate-600 text-sm">Training Programs</p>
            <Link
              href="/dashboard/instructor/training-programs"
              className="text-orange-600 text-sm font-medium hover:text-orange-700 mt-2 inline-flex items-center gap-1"
            >
              Manage <Settings className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Activity
                </h2>
                <Link
                  href="/dashboard/instructor/activity"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-[12px] hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${
                          activity.type === "session"
                            ? "bg-blue-100"
                            : activity.type === "student"
                            ? "bg-green-100"
                            : activity.type === "program"
                            ? "bg-orange-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {activity.type === "session" ? (
                          <Calendar className="w-5 h-5 text-blue-600" />
                        ) : activity.type === "student" ? (
                          <Users className="w-5 h-5 text-green-600" />
                        ) : activity.type === "program" ? (
                          <BookOpen className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Star className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {activity.title}
                        </h3>
                        <p className="text-slate-600 text-sm">
                          {activity.description}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : activity.status === "upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/instructor-availability"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-[12px] hover:bg-blue-100 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Manage Availability</span>
                </Link>
                <Link
                  href="/dashboard/sessions/instructor"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-[12px] hover:bg-green-100 transition-colors"
                >
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-slate-700">View Sessions</span>
                </Link>
                <Link
                  href="/dashboard/instructor/students"
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-[12px] hover:bg-purple-100 transition-colors"
                >
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700">Manage Students</span>
                </Link>
                <Link
                  href="/dashboard/instructor/analytics"
                  className="flex items-center gap-3 p-3 bg-orange-50 rounded-[12px] hover:bg-orange-100 transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span className="text-slate-700">View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Performance
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sessions Completed</span>
                  <span className="font-semibold text-slate-900">
                    {stats?.completedSessions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Upcoming Sessions</span>
                  <span className="font-semibold text-slate-900">
                    {stats?.upcomingSessions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Monthly Earnings</span>
                  <span className="font-semibold text-green-600">
                    ${stats?.monthlyEarnings?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Availability Hours</span>
                  <span className="font-semibold text-slate-900">
                    {stats?.availabilityHours || 0}h/week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
