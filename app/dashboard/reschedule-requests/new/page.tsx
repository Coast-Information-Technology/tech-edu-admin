"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Search,
  CalendarDays,
  User,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Attendance {
  _id: string;
  sessionId: {
    _id: string;
    title: string;
    sessionType: string;
    startTime: string;
    endTime: string;
  };
  studentId: {
    _id: string;
    fullName: string;
    email: string;
  };
  instructorId: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: string;
}

interface RescheduleForm {
  attendanceId: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
}

export default function NewRescheduleRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [gracePeriodStatus, setGracePeriodStatus] = useState<any>(null);
  const [form, setForm] = useState<RescheduleForm>({
    attendanceId: "",
    oldStartTime: "",
    oldEndTime: "",
    newStartTime: "",
    newEndTime: "",
    reason: "",
  });

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    setError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await getApiRequest("/api/attendances/upcoming", token);

      if (response?.data?.success) {
        setAttendances(response.data.data);
      } else {
        setError(response?.data?.message || "Failed to load attendances");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendances");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSelect = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setForm({
      attendanceId: attendance._id,
      oldStartTime: attendance.sessionId.startTime,
      oldEndTime: attendance.sessionId.endTime,
      newStartTime: "",
      newEndTime: "",
      reason: "",
    });

    // Check grace period status for this attendance
    fetchGracePeriodStatus(attendance._id);
  };

  const fetchGracePeriodStatus = async (attendanceId: string) => {
    const token = getTokenFromCookies();
    if (!token) return;

    try {
      const response = await getApiRequest(
        `/api/reschedule/${attendanceId}/grace-period-status`,
        token
      );

      if (response?.data?.success) {
        setGracePeriodStatus(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch grace period status:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newStartTime" && selectedAttendance) {
      const startTime = new Date(value);
      const duration =
        new Date(selectedAttendance.sessionId.endTime).getTime() -
        new Date(selectedAttendance.sessionId.startTime).getTime();
      const endTime = new Date(startTime.getTime() + duration);
      setForm((prev) => ({
        ...prev,
        newEndTime: endTime.toISOString().slice(0, 16),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.attendanceId) {
      setError("Please select an attendance record");
      return;
    }

    if (!form.newStartTime || !form.newEndTime) {
      setError("Please select new start and end times");
      return;
    }

    if (!form.reason.trim()) {
      setError("Please provide a reason for the reschedule request");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        attendanceId: form.attendanceId,
        oldStartTime: form.oldStartTime,
        oldEndTime: form.oldEndTime,
        newStartTime: form.newStartTime,
        newEndTime: form.newEndTime,
        reason: form.reason.trim(),
      };

      const response = await postApiRequest(
        "/api/reschedule/request",
        token,
        payload
      );

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/reschedule-requests");
        }, 2000);
      } else {
        setError(
          response?.data?.message || "Failed to create reschedule request"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to create reschedule request");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredAttendances = attendances.filter(
    (attendance) =>
      attendance.sessionId.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      attendance.studentId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      attendance.instructorId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">
                Loading attendance records...
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
            <Link href="/dashboard/reschedule-requests">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New Reschedule Request
              </h1>
              <p className="text-slate-600">
                Request to reschedule an upcoming session
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
                Reschedule request created successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Attendance Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Select Session to Reschedule
              </h2>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by session title, student, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {filteredAttendances.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    {searchTerm
                      ? "No sessions found matching your search"
                      : "No upcoming sessions available"}
                  </p>
                </div>
              ) : (
                filteredAttendances.map((attendance) => (
                  <div
                    key={attendance._id}
                    onClick={() => handleAttendanceSelect(attendance)}
                    className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedAttendance?._id === attendance._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {attendance.sessionId.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{attendance.studentId.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{attendance.instructorId.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                              {formatDate(attendance.sessionId.startTime)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTime(attendance.sessionId.startTime)} -{" "}
                            {formatTime(attendance.sessionId.endTime)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attendance.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {attendance.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reschedule Details */}
          {selectedAttendance && (
            <>
              {/* Grace Period Status */}
              {gracePeriodStatus && (
                <div
                  className={`mb-8 rounded-2xl p-6 flex items-center gap-4 ${
                    gracePeriodStatus.isWithinGracePeriod
                      ? "bg-green-50/80 border border-green-200"
                      : "bg-red-50/80 border border-red-200"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      gracePeriodStatus.isWithinGracePeriod
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {gracePeriodStatus.isWithinGracePeriod ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        gracePeriodStatus.isWithinGracePeriod
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Grace Period Status
                    </h3>
                    <p
                      className={`${
                        gracePeriodStatus.isWithinGracePeriod
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {gracePeriodStatus.isWithinGracePeriod
                        ? `Within grace period - ${gracePeriodStatus.remainingTime} remaining`
                        : "Grace period expired - cannot be rescheduled"}
                    </p>
                    {gracePeriodStatus.gracePeriodEnd && (
                      <p className="text-sm text-slate-600 mt-1">
                        Grace period ends:{" "}
                        {formatDate(gracePeriodStatus.gracePeriodEnd)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Current Schedule */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Current Schedule
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="oldStartTime"
                      value={form.oldStartTime}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Current End Time
                    </label>
                    <input
                      type="datetime-local"
                      name="oldEndTime"
                      value={form.oldEndTime}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* New Schedule */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    New Schedule
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="newStartTime"
                      value={form.newStartTime}
                      onChange={handleChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New End Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="newEndTime"
                      value={form.newEndTime}
                      onChange={handleChange}
                      min={
                        form.newStartTime ||
                        new Date().toISOString().slice(0, 16)
                      }
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Reason for Reschedule
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reason *
                  </label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Please provide a detailed reason for the reschedule request..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This reason will be reviewed by administrators
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end gap-4">
              <Link href="/dashboard/reschedule-requests">
                <button
                  type="button"
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving || !selectedAttendance}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Request
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
