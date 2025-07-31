"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
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

export default function CancelSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

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
          const sessionData = response.data.data;
          setSession(sessionData);

          // Check if session can be cancelled
          if (sessionData.status !== "upcoming") {
            setError("Only upcoming sessions can be cancelled.");
          }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cancellationReason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        cancellationReason: cancellationReason.trim(),
      };

      console.log("Cancelling session with payload:", payload);

      const response = await updateApiRequest(
        `/api/sessions/${params.id as string}/cancel`,
        token,
        payload
      );
      console.log("Session cancellation response:", response);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/sessions/${params.id}`);
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to cancel session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to cancel session");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
              <Link href={`/dashboard/sessions/${params.id}`}>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Back to Session
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Session Not Found
              </h3>
              <p className="text-red-700">
                The session you're looking for doesn't exist.
              </p>
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
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/dashboard/sessions/${params.id}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Cancel Session
              </h1>
              <p className="text-slate-600">
                Cancel this session and provide a reason
              </p>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-8 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Warning</h3>
            <p className="text-yellow-700">
              Cancelling this session will mark it as cancelled and notify all
              participants. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
              <p className="text-green-700">
                Session cancelled successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Session Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Session Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Session ID
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {session._id.slice(-8)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Booking ID
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {session.bookingId}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Type
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {session.productType}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Session Type
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {session.sessionType || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Scheduled Date
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {formatDate(session.scheduleAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duration
              </label>
              <p className="text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {session.minutesPerSession || 0} minutes
              </p>
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

        {/* Cancellation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Cancellation Details
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason for Cancellation *
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Please provide a reason for cancelling this session..."
              rows={4}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
              required
            />
            <p className="text-sm text-slate-500 mt-2">
              This reason will be shared with participants and recorded for
              administrative purposes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link href={`/dashboard/sessions/${params.id}`}>
              <button
                type="button"
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                Keep Session
              </button>
            </Link>
            <button
              type="submit"
              disabled={cancelling || !cancellationReason.trim()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {cancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancel Session
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
