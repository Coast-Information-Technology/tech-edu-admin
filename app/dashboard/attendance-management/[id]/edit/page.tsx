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
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface AttendanceForm {
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  remarks: string;
}

export default function EditAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<AttendanceForm>({
    scheduleAt: "",
    endAt: "",
    durationInMinutes: 60,
    remarks: "",
  });

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
      console.log("Attendance API response:", response);

      if (response?.data?.success) {
        const attendanceData = response.data.data;
        setAttendance(attendanceData);

        // Pre-populate form with existing data
        setForm({
          scheduleAt: attendanceData.scheduleAt
            ? attendanceData.scheduleAt.slice(0, 16)
            : "",
          endAt: attendanceData.endAt ? attendanceData.endAt.slice(0, 16) : "",
          durationInMinutes: attendanceData.durationInMinutes || 60,
          remarks: attendanceData.remarks || "",
        });
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setForm((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.scheduleAt || !form.endAt || form.durationInMinutes <= 0) {
      setError("Please fill all required fields.");
      return;
    }

    // Validate that end time is after start time
    if (new Date(form.endAt) <= new Date(form.scheduleAt)) {
      setError("End time must be after start time.");
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
        scheduleAt: new Date(form.scheduleAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        durationInMinutes: form.durationInMinutes,
        remarks: form.remarks,
      };

      console.log("Updating attendance with payload:", payload);

      const response = await updateApiRequest(
        `/api/attendance/${params.id}`,
        token,
        payload
      );
      console.log("Attendance update response:", response);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/attendance-management/${params.id}`);
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to update attendance");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update attendance");
    } finally {
      setSaving(false);
    }
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

  if (error || !attendance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error || "Attendance not found"}</p>
          <Link href="/dashboard/attendance-management">
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300">
              Back to Attendance Management
            </button>
          </Link>
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
            <Link href={`/dashboard/attendance-management/${params.id}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Attendance
              </h1>
              <p className="text-slate-600">
                Update attendance schedule and details
              </p>
            </div>
          </div>

          {/* Current Attendance Info */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              {attendance.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Product Type:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  {attendance.productType}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <span className="ml-2 font-semibold text-slate-900 capitalize">
                  {attendance.status.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Participants:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  {attendance.numberOfExpectedParticipants}
                </span>
              </div>
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
                Attendance updated successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Schedule */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduleAt"
                  value={form.scheduleAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="endAt"
                  value={form.endAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="durationInMinutes"
                  value={form.durationInMinutes}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="60"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Remarks</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Add any additional notes or remarks about this attendance..."
                rows={4}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end gap-4">
              <Link href={`/dashboard/attendance-management/${params.id}`}>
                <button
                  type="button"
                  className="px-8 py-4 text-slate-700 bg-slate-100 font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Attendance
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
