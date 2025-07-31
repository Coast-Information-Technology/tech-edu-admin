"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Save,
  AlertCircle,
  Star,
  FileText,
  Video,
  MapPin,
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

interface CompletionForm {
  completionNotes: string;
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
}

export default function CompleteSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<CompletionForm>({
    completionNotes: "",
    attendance: {
      present: 0,
      absent: 0,
      total: 0,
    },
  });

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
          `/api/sessions/${sessionId}`,
          token
        );
        console.log("Session API response:", response);

        if (response?.data?.success) {
          const sessionData = response.data.data;
          setSession(sessionData);
          // Pre-populate total attendance based on expected participants
          setForm((prev) => ({
            ...prev,
            attendance: {
              ...prev.attendance,
              total: sessionData.numberOfExpectedParticipants || 0,
            },
          }));
        } else {
          setError(response?.data?.message || "Failed to load session");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    setForm((prev) => {
      const newAttendance = {
        ...prev.attendance,
        [name]: numValue,
      };

      // Ensure present + absent doesn't exceed total
      if (name === "present") {
        newAttendance.absent = Math.max(0, newAttendance.total - numValue);
      } else if (name === "absent") {
        newAttendance.present = Math.max(0, newAttendance.total - numValue);
      } else if (name === "total") {
        // When total changes, adjust present and absent proportionally
        const currentPresent = prev.attendance.present;
        const currentAbsent = prev.attendance.absent;
        const currentTotal = prev.attendance.total;

        if (currentTotal > 0) {
          const presentRatio = currentPresent / currentTotal;
          const absentRatio = currentAbsent / currentTotal;
          newAttendance.present = Math.round(numValue * presentRatio);
          newAttendance.absent = Math.round(numValue * absentRatio);
        } else {
          newAttendance.present = 0;
          newAttendance.absent = 0;
        }
      }

      return {
        ...prev,
        attendance: newAttendance,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.completionNotes.trim()) {
      setError("Please provide completion notes.");
      return;
    }

    if (form.attendance.total < 0) {
      setError("Total attendance cannot be negative.");
      return;
    }

    if (
      form.attendance.present + form.attendance.absent !==
      form.attendance.total
    ) {
      setError(
        "Present and absent participants must equal total participants."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        completionNotes: form.completionNotes,
        attendance: form.attendance,
      };

      console.log("Completing session with payload:", payload);

      const response = await updateApiRequest(
        `/api/sessions/${sessionId}/complete`,
        token,
        payload
      );
      console.log("Session completion response:", response);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/sessions/instructor");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to complete session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete session");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 text-lg">
                Loading session details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Session Not Found
            </h3>
            <p className="text-slate-600">
              The session you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only allow completion for confirmed sessions
  if (session.status.toLowerCase() !== "confirmed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Cannot Complete Session
              </h3>
              <p className="text-yellow-700">
                Only confirmed sessions can be marked as completed. Current
                status: {session.status}
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
            <Link href={`/dashboard/sessions/${sessionId}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Complete Session
              </h1>
              <p className="text-slate-600">
                Mark this session as completed and record attendance
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
              <p className="text-green-700">
                Session completed successfully. Redirecting to sessions list...
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Session Purpose
                </label>
                <p className="text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl">
                  {session.bookingPurpose || "Mentoring Session"}
                </p>
              </div>

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
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200">
                  {session.sessionType || "1-on-1"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                    session.status
                  )}`}
                >
                  {session.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Schedule Date
                </label>
                <p className="text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl">
                  {formatDate(session.scheduleAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duration
                </label>
                <p className="text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl">
                  {session.minutesPerSession || 60} minutes
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expected Participants
                </label>
                <p className="text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl">
                  {session.numberOfExpectedParticipants || 1} participants
                </p>
              </div>

              {session.meetingLink && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Meeting Link
                  </label>
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300"
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completion Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Complete Session
            </h2>
          </div>

          <div className="space-y-6">
            {/* Completion Notes */}
            <div>
              <label
                htmlFor="completionNotes"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Completion Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                id="completionNotes"
                name="completionNotes"
                value={form.completionNotes}
                onChange={handleChange}
                rows={4}
                placeholder="Provide details about the session completion, key takeaways, and any follow-up actions..."
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-slate-400 resize-none"
                required
              />
            </div>

            {/* Attendance Section */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Attendance Record
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="total"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Total Participants
                  </label>
                  <input
                    type="number"
                    id="total"
                    name="total"
                    value={form.attendance.total}
                    onChange={handleAttendanceChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="present"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Present
                  </label>
                  <input
                    type="number"
                    id="present"
                    name="present"
                    value={form.attendance.present}
                    onChange={handleAttendanceChange}
                    min="0"
                    max={form.attendance.total}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="absent"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Absent
                  </label>
                  <input
                    type="number"
                    id="absent"
                    name="absent"
                    value={form.attendance.absent}
                    onChange={handleAttendanceChange}
                    min="0"
                    max={form.attendance.total}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Attendance Summary:</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 font-semibold">
                      Present: {form.attendance.present}
                    </span>
                    <span className="text-red-600 font-semibold">
                      Absent: {form.attendance.absent}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      Total: {form.attendance.total}
                    </span>
                  </div>
                </div>
                {form.attendance.present + form.attendance.absent !==
                  form.attendance.total && (
                  <p className="text-red-600 text-sm mt-2">
                    ⚠️ Present and absent participants must equal total
                    participants
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200">
            <Link href={`/dashboard/sessions/${sessionId}`}>
              <button
                type="button"
                className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting || !form.completionNotes.trim()}
              className="flex-1 group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing Session...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    Complete Session
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
