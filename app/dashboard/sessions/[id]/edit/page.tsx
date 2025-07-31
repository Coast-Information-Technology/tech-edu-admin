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
  Video,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface SessionForm {
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  numberOfExpectedParticipants: number;
  meetingLink: string;
  sessionType: string;
  userNotes: string;
  internalNotes: string;
}

const PRODUCT_TYPE_OPTIONS = [
  "AcademicService",
  "TrainingProgram",
  "Consultancy",
  "Mentoring",
  "Coaching",
  "Workshop",
  "Seminar",
  "Webinar",
  "Assessment",
  "Evaluation",
];

const SESSION_TYPE_OPTIONS = [
  "1-on-1",
  "group",
  "workshop",
  "seminar",
  "webinar",
];

export default function EditSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<SessionForm>({
    bookingId: "",
    productId: "",
    productType: "",
    bookingPurpose: "",
    scheduleAt: "",
    endAt: "",
    minutesPerSession: 60,
    numberOfExpectedParticipants: 1,
    meetingLink: "",
    sessionType: "1-on-1",
    userNotes: "",
    internalNotes: "",
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
          `/api/sessions/${params.id}`,
          token
        );
        console.log("Session detail API response:", response);

        if (response?.data?.success) {
          const sessionData = response.data.data;
          setForm({
            bookingId: sessionData.bookingId || "",
            productId: sessionData.productId || "",
            productType: sessionData.productType || "",
            bookingPurpose: sessionData.bookingPurpose || "",
            scheduleAt: sessionData.scheduleAt
              ? new Date(sessionData.scheduleAt).toISOString().slice(0, 16)
              : "",
            endAt: sessionData.endAt
              ? new Date(sessionData.endAt).toISOString().slice(0, 16)
              : "",
            minutesPerSession: sessionData.minutesPerSession || 60,
            numberOfExpectedParticipants:
              sessionData.numberOfExpectedParticipants || 1,
            meetingLink: sessionData.meetingLink || "",
            sessionType: sessionData.sessionType || "1-on-1",
            userNotes: sessionData.userNotes || "",
            internalNotes: sessionData.internalNotes || "",
          });
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

    setSaving(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        bookingId: form.bookingId,
        productId: form.productId,
        productType: form.productType,
        bookingPurpose: form.bookingPurpose,
        scheduleAt: form.scheduleAt,
        endAt: form.endAt,
        minutesPerSession: form.minutesPerSession,
        numberOfExpectedParticipants: form.numberOfExpectedParticipants,
        meetingLink: form.meetingLink,
        sessionType: form.sessionType,
        userNotes: form.userNotes,
        internalNotes: form.internalNotes,
      };

      console.log("Updating session with payload:", payload);

      const response = await updateApiRequest(
        `/api/sessions/${params.id as string}`,
        token,
        payload
      );
      console.log("Session update response:", response);

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/sessions/${params.id}`);
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to update session");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update session");
    } finally {
      setSaving(false);
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Session
              </h1>
              <p className="text-slate-600">
                Update session information and settings
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
                Session updated successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Session Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Session Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Booking ID *
                </label>
                <input
                  type="text"
                  name="bookingId"
                  value={form.bookingId}
                  onChange={handleChange}
                  placeholder="Enter booking ID"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product ID *
                </label>
                <input
                  type="text"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  placeholder="Enter product ID"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Type *
                </label>
                <select
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select product type</option>
                  {PRODUCT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Booking Purpose *
                </label>
                <textarea
                  name="bookingPurpose"
                  value={form.bookingPurpose}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this session"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                  name="minutesPerSession"
                  value={form.minutesPerSession}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="60"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Configuration
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Session Type *
                </label>
                <select
                  name="sessionType"
                  value={form.sessionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  {SESSION_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expected Participants *
                </label>
                <input
                  type="number"
                  name="numberOfExpectedParticipants"
                  value={form.numberOfExpectedParticipants}
                  onChange={handleNumberChange}
                  min="1"
                  placeholder="1"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  User Notes
                </label>
                <textarea
                  name="userNotes"
                  value={form.userNotes}
                  onChange={handleChange}
                  placeholder="Notes for participants"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Internal Notes
                </label>
                <textarea
                  name="internalNotes"
                  value={form.internalNotes}
                  onChange={handleChange}
                  placeholder="Internal notes for instructors"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end gap-4">
              <Link href={`/dashboard/sessions/${params.id}`}>
                <button
                  type="button"
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Session
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
