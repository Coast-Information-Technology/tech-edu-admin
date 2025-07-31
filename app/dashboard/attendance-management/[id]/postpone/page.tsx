"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Pause,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function PostponeAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [postponing, setPostponing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    newScheduleAt: "",
    newEndAt: "",
    reason: "",
  });
  const [result, setResult] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);

  useEffect(() => {
    fetchAttendance();
  }, [params.id]);

  const fetchAttendance = async () => {
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
        `/api/attendance/${params.id}`,
        token
      );
      if (response?.data?.success) {
        setAttendance(response.data.data);
        setForm((prev) => ({
          ...prev,
          newScheduleAt: response.data.data.scheduleAt?.slice(0, 16) || "",
          newEndAt: response.data.data.endAt?.slice(0, 16) || "",
        }));
      } else {
        setError(response?.data?.message || "Failed to load attendance");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.newScheduleAt || !form.newEndAt || !form.reason.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(form.newEndAt) <= new Date(form.newScheduleAt)) {
      setError("End time must be after start time.");
      return;
    }
    setPostponing(true);
    setError(null);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setPostponing(false);
        return;
      }
      const payload = {
        newScheduleAt: new Date(form.newScheduleAt).toISOString(),
        newEndAt: new Date(form.newEndAt).toISOString(),
        reason: form.reason,
      };
      const response = await updateApiRequest(
        `/api/attendance/${params.id}/postpone`,
        token,
        payload
      );
      if (response?.data?.success) {
        setResult(response.data.data);
        setSuccess(true);
      } else {
        setError(response?.data?.message || "Failed to postpone attendance");
      }
    } catch (err: any) {
      setError(err.message || "Failed to postpone attendance");
    } finally {
      setPostponing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">
            Loading attendance details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <Link href="/dashboard/attendance-management">
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300">
              Back to Attendance Management
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (success && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800">
                Attendance Postponed!
              </h2>
              <p className="text-slate-700">
                The attendance has been postponed and a new session has been
                scheduled.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Original Attendance */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <Pause className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-slate-900">
                  Original Attendance (Postponed)
                </span>
              </div>
              <div className="mb-2 text-slate-700">
                <span className="font-semibold">Status:</span>{" "}
                {result.originalAttendance.status}
              </div>
              <div className="mb-2 text-slate-700">
                <span className="font-semibold">Postponed To:</span>{" "}
                {formatDate(result.originalAttendance.postponedTo.date)}
              </div>
              <div className="mb-2 text-slate-700">
                <span className="font-semibold">Reason:</span>{" "}
                {result.originalAttendance.postponedTo.reason}
              </div>
            </div>

            {/* New Attendance */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-slate-900">
                  New Attendance (Rescheduled)
                </span>
              </div>
              <div className="mb-2 text-slate-700">
                <span className="font-semibold">Status:</span>{" "}
                {result.newAttendance.status}
              </div>
              <div className="mb-2 text-slate-700">
                <span className="font-semibold">Schedule:</span>{" "}
                {formatDate(result.newAttendance.scheduleAt)} -{" "}
                {formatDate(result.newAttendance.endAt)}
              </div>
              {result.newAttendance.rescheduledMeetingLink && (
                <div className="mb-2 text-slate-700">
                  <span className="font-semibold">Meeting Link:</span>{" "}
                  <a
                    href={result.newAttendance.rescheduledMeetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Join Meeting <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/attendance-management">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Back to Attendance Management
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/dashboard/attendance-management/${params.id}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Postpone Attendance
              </h1>
              <p className="text-slate-600">
                Reschedule this attendance and notify participants
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Pause className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Reschedule Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="newScheduleAt"
                  value={form.newScheduleAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="newEndAt"
                  value={form.newEndAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reason for Postponement *
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Provide a reason for postponing this attendance..."
                rows={3}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                required
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={postponing}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {postponing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Postponing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Postpone Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
