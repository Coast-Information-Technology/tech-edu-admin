"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Edit,
  XCircle,
  Video,
  FileText,
  MapPin,
  Star,
  CheckCircle,
  Play,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Session {
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
  sessionType?: string;
  status: string;
  userNotes?: string;
  internalNotes?: string;
  avgRating?: number;
  createdAt: string;
  updatedAt?: string;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
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
          `/api/sessions/${params.id}`,
          token
        );
        console.log("Session detail API response:", response);

        if (response?.data?.success) {
          setSession(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load session");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSession();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "confirmed":
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
        return <Calendar className="w-4 h-4" />;
      case "confirmed":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getSessionTypeColor = (sessionType: string) => {
    switch (sessionType?.toLowerCase()) {
      case "1-on-1":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "group":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      case "workshop":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "seminar":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "webinar":
        return "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">
                Loading session details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error || "Session not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/sessions">
                <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Session Details
                </h1>
                <p className="text-slate-600">
                  View session information and manage actions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {session.status === "upcoming" && (
                <Link href={`/dashboard/sessions/${session._id}/edit`}>
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </Link>
              )}
              {session.status === "upcoming" && (
                <Link href={`/dashboard/sessions/${session._id}/cancel`}>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Session Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Session Info
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">ID:</span>{" "}
                  {session._id.slice(-8)}
                </div>
                <div>
                  <span className="font-medium">Booking ID:</span>{" "}
                  {session.bookingId}
                </div>
                <div>
                  <span className="font-medium">Product ID:</span>{" "}
                  {session.productId}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Schedule
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Start:</span>{" "}
                  {formatDate(session.scheduleAt)}
                </div>
                {session.endAt && (
                  <div>
                    <span className="font-medium">End:</span>{" "}
                    {formatDate(session.endAt)}
                  </div>
                )}
                {session.minutesPerSession && (
                  <div>
                    <span className="font-medium">Duration:</span>{" "}
                    {session.minutesPerSession} min
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Participants
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Expected:</span>{" "}
                  {session.numberOfExpectedParticipants || 0}
                </div>
                {session.avgRating && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Rating:</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{session.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Session Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Session Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Type
                  </label>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                    {session.productType}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Session Type
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getSessionTypeColor(
                      session.sessionType || ""
                    )}`}
                  >
                    {session.sessionType || "N/A"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                      session.status
                    )}`}
                  >
                    {getStatusIcon(session.status)}
                    {session.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meeting Link
                  </label>
                  {session.meetingLink ? (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">
                      No link available
                    </span>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Booking Purpose
                  </label>
                  <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    {session.bookingPurpose || "No purpose specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Notes</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    User Notes
                  </label>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 min-h-[100px]">
                    {session.userNotes ? (
                      <p className="text-slate-900 whitespace-pre-wrap">
                        {session.userNotes}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic">
                        No user notes available
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Internal Notes
                  </label>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 min-h-[100px]">
                    {session.internalNotes ? (
                      <p className="text-slate-900 whitespace-pre-wrap">
                        {session.internalNotes}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic">
                        No internal notes available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Metadata */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                {session.status === "upcoming" && (
                  <>
                    <Link href={`/dashboard/sessions/${session._id}/edit`}>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit Session
                      </button>
                    </Link>
                    <Link href={`/dashboard/sessions/${session._id}/cancel`}>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Cancel Session
                      </button>
                    </Link>
                  </>
                )}

                {session.meetingLink && session.status === "confirmed" && (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </a>
                )}
              </div>
            </div>

            {/* Session Metadata */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Session Metadata
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="font-medium text-slate-900">
                    {formatDate(session.createdAt)}
                  </span>
                </div>
                {session.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Updated:</span>
                    <span className="font-medium text-slate-900">
                      {formatDate(session.updatedAt)}
                    </span>
                  </div>
                )}
                {session.instructorId && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Instructor ID:</span>
                    <span className="font-medium text-slate-900">
                      {session.instructorId.slice(-8)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">Session ID:</span>
                  <span className="font-medium text-slate-900 font-mono">
                    {session._id.slice(-8)}
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
