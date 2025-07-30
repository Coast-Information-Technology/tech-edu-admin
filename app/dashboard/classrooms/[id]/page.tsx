"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  Edit,
  ArrowLeft,
  MapPin,
  FileText,
  MessageSquare,
  CalendarDays,
  Play,
  CheckCircle,
  XCircle,
  ExternalLink,
  User,
  Tag,
  Info,
} from "lucide-react";
import Link from "next/link";

interface Classroom {
  _id: string;
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose?: string;
  instructorId?: string;
  scheduleAt: string;
  endAt?: string;
  minutesPerSession?: number;
  numberOfExpectedParticipants?: number;
  meetingLink?: string;
  status: string;
  instructorNotes?: string;
  internalNotes?: string;
  actualDaysAndTime?: Array<{
    day: string;
    time: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getApiRequest(
          `/api/classrooms/${params.id}`,
          token
        );
        console.log("Classroom API response:", response);

        if (response?.data?.success) {
          setClassroom(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load classroom");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load classroom");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClassroom();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-5 h-5" />;
      case "active":
        return <Play className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 text-lg">
                Loading classroom details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error || "Classroom not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/classrooms">
                <button className="p-3 rounded-2xl bg-white/50 border border-slate-200 hover:bg-white/80 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {classroom.bookingPurpose || "Classroom Session"}
                </h1>
                <p className="text-slate-600">
                  Classroom ID: {classroom._id.slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  classroom.status
                )}`}
              >
                {getStatusIcon(classroom.status)}
                {classroom.status}
              </span>
              {classroom.status === "upcoming" && (
                <Link href={`/dashboard/classrooms/${classroom._id}/edit`}>
                  <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </span>
                  </button>
                </Link>
              )}
              {classroom.meetingLink && (
                <a
                  href={classroom.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Session Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Product Type
                    </label>
                    <p className="text-lg font-semibold text-slate-900 mt-1">
                      {classroom.productType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Booking Purpose
                    </label>
                    <p className="text-lg text-slate-900 mt-1">
                      {classroom.bookingPurpose || "Training Session"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Session Duration
                    </label>
                    <p className="text-lg text-slate-900 mt-1">
                      {classroom.minutesPerSession || 0} minutes
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Expected Participants
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-5 h-5 text-slate-500" />
                      <p className="text-lg font-semibold text-slate-900">
                        {classroom.numberOfExpectedParticipants || 0}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Booking ID
                    </label>
                    <p className="text-sm text-slate-600 mt-1 font-mono">
                      {classroom.bookingId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Product ID
                    </label>
                    <p className="text-sm text-slate-600 mt-1 font-mono">
                      {classroom.productId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      Start Date & Time
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5 text-slate-500" />
                      <p className="text-lg font-semibold text-slate-900">
                        {formatDate(classroom.scheduleAt)}
                      </p>
                    </div>
                  </div>
                  {classroom.endAt && (
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        End Date & Time
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <p className="text-lg font-semibold text-slate-900">
                          {formatDate(classroom.endAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {classroom.actualDaysAndTime &&
                  classroom.actualDaysAndTime.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        Recurring Schedule
                      </label>
                      <div className="mt-3 space-y-2">
                        {classroom.actualDaysAndTime.map((schedule, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl"
                          >
                            <CalendarDays className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-semibold text-slate-900">
                              {schedule.day}
                            </span>
                            <span className="text-sm text-slate-600">•</span>
                            <span className="text-sm text-slate-600">
                              {schedule.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Notes Section */}
            {(classroom.instructorNotes || classroom.internalNotes) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
                </div>

                <div className="space-y-6">
                  {classroom.instructorNotes && (
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Instructor Notes
                      </label>
                      <p className="text-slate-900 mt-2 p-4 bg-slate-50 rounded-xl">
                        {classroom.instructorNotes}
                      </p>
                    </div>
                  )}

                  {classroom.internalNotes && (
                    <div>
                      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Internal Notes
                      </label>
                      <p className="text-slate-900 mt-2 p-4 bg-slate-50 rounded-xl">
                        {classroom.internalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Meeting Link Card */}
            {classroom.meetingLink && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Video className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Meeting Link
                  </h3>
                </div>
                <a
                  href={classroom.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Join Meeting
                  </span>
                </a>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Status</h3>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  classroom.status
                )}`}
              >
                {getStatusIcon(classroom.status)}
                {classroom.status}
              </span>
            </div>

            {/* Timestamps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Timestamps</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created
                  </label>
                  <p className="text-sm text-slate-900 mt-1">
                    {formatDate(classroom.createdAt)}
                  </p>
                </div>
                {classroom.updatedAt && (
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Last Updated
                    </label>
                    <p className="text-sm text-slate-900 mt-1">
                      {formatDate(classroom.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-3">
                {classroom.status === "upcoming" && (
                  <Link href={`/dashboard/classrooms/${classroom._id}/edit`}>
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300">
                      <span className="flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Classroom
                      </span>
                    </button>
                  </Link>
                )}
                <Link href="/dashboard/classrooms">
                  <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Classrooms
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
