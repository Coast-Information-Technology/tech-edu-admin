"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, updateApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  Video,
  BookOpen,
  Save,
  ArrowLeft,
  X,
  CheckCircle,
  FileText,
  UserCheck,
  UserX,
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

interface FormData {
  completionNotes: string;
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
}

export default function CompleteClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    completionNotes: "",
    attendance: {
      present: 0,
      absent: 0,
      total: 0,
    },
  });

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
          const classroomData = response.data.data;
          setClassroom(classroomData);

          // Pre-populate form with expected participants
          setForm((prev) => ({
            ...prev,
            attendance: {
              present: classroomData.numberOfExpectedParticipants || 0,
              absent: 0,
              total: classroomData.numberOfExpectedParticipants || 0,
            },
          }));
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendanceChange = (
    field: "present" | "absent",
    value: number
  ) => {
    setForm((prev) => {
      const newAttendance = {
        ...prev.attendance,
        [field]: value,
        total:
          field === "present"
            ? value + prev.attendance.absent
            : prev.attendance.present + value,
      };

      return {
        ...prev,
        attendance: newAttendance,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      setSaving(false);
      return;
    }

    // Validation
    if (!form.completionNotes.trim()) {
      setError("Please provide completion notes");
      setSaving(false);
      return;
    }

    if (form.attendance.present < 0 || form.attendance.absent < 0) {
      setError("Attendance numbers cannot be negative");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        completionNotes: form.completionNotes,
        attendance: form.attendance,
      };

      console.log("Completing classroom with payload:", payload);

      const response = await updateApiRequest(
        `/api/classrooms/${params.id}/complete-session`,
        token,
        payload
      );

      if (response?.data?.success) {
        setSuccess("Classroom session completed successfully!");
        setTimeout(() => {
          router.push(`/dashboard/classrooms/${params.id}`);
        }, 2000);
      } else {
        setError(
          response?.data?.message || "Failed to complete classroom session"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to complete classroom session");
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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

  if (error && !classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
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

  if (!classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-red-800">
              Classroom not found
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (classroom.status !== "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Cannot Complete Session
            </h3>
            <p className="text-yellow-700 mb-4">
              Only active classroom sessions can be completed. Current status:{" "}
              {classroom.status}
            </p>
            <Link href={`/dashboard/classrooms/${classroom._id}`}>
              <button className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-2xl hover:bg-yellow-600 transition-all duration-300">
                Back to Classroom
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/classrooms/${classroom._id}`}>
                <button className="p-3 rounded-2xl bg-white/50 border border-slate-200 hover:bg-white/80 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  Complete Classroom Session
                </h1>
                <p className="text-slate-600">
                  {classroom.bookingPurpose || "Training Session"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/dashboard/classrooms/${classroom._id}`}>
                <button className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-300">
                  Cancel
                </button>
              </Link>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {saving ? "Completing..." : "Complete Session"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success</h3>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Classroom Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Session Summary
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
                  Schedule
                </label>
                <p className="text-lg text-slate-900 mt-1">
                  {formatDate(classroom.scheduleAt)}
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
                  Status
                </label>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  {classroom.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Attendance Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Attendance
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Present
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    <input
                      type="number"
                      value={form.attendance.present}
                      onChange={(e) =>
                        handleAttendanceChange(
                          "present",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max={classroom.numberOfExpectedParticipants || 0}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Absent
                  </label>
                  <div className="relative">
                    <UserX className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                    <input
                      type="number"
                      value={form.attendance.absent}
                      onChange={(e) =>
                        handleAttendanceChange(
                          "absent",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      max={classroom.numberOfExpectedParticipants || 0}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Total
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="number"
                      value={form.attendance.total}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-600">
                  <strong>Note:</strong> Total attendance should equal the
                  expected participants (
                  {classroom.numberOfExpectedParticipants || 0}). Current total:{" "}
                  {form.attendance.total}
                </p>
              </div>
            </div>

            {/* Completion Notes Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Completion Notes
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Session Summary *
                </label>
                <textarea
                  name="completionNotes"
                  value={form.completionNotes}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Provide a summary of the completed session, including key topics covered, participant engagement, and any notable outcomes..."
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
              <Link
                href={`/dashboard/classrooms/${classroom._id}`}
                className="flex-1"
              >
                <button
                  type="button"
                  className="w-full px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {saving ? "Completing Session..." : "Complete Session"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
