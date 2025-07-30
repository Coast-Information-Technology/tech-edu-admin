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
  Plus,
  Trash2,
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
  scheduleAt: string;
  endAt: string;
  meetingLink: string;
  instructorNotes: string;
  actualDaysAndTime: Array<{
    day: string;
    time: string;
  }>;
}

export default function EditClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    scheduleAt: "",
    endAt: "",
    meetingLink: "",
    instructorNotes: "",
    actualDaysAndTime: [],
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

          // Pre-populate form with existing data
          setForm({
            scheduleAt: classroomData.scheduleAt
              ? new Date(classroomData.scheduleAt).toISOString().slice(0, 16)
              : "",
            endAt: classroomData.endAt
              ? new Date(classroomData.endAt).toISOString().slice(0, 16)
              : "",
            meetingLink: classroomData.meetingLink || "",
            instructorNotes: classroomData.instructorNotes || "",
            actualDaysAndTime: classroomData.actualDaysAndTime || [],
          });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addRecurringSchedule = () => {
    setForm((prev) => ({
      ...prev,
      actualDaysAndTime: [...prev.actualDaysAndTime, { day: "", time: "" }],
    }));
  };

  const removeRecurringSchedule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      actualDaysAndTime: prev.actualDaysAndTime.filter((_, i) => i !== index),
    }));
  };

  const updateRecurringSchedule = (
    index: number,
    field: "day" | "time",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      actualDaysAndTime: prev.actualDaysAndTime.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule
      ),
    }));
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

    try {
      // Prepare payload with only the fields that can be updated
      const payload = {
        scheduleAt: form.scheduleAt
          ? new Date(form.scheduleAt).toISOString()
          : undefined,
        endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
        meetingLink: form.meetingLink || undefined,
        instructorNotes: form.instructorNotes || undefined,
        actualDaysAndTime:
          form.actualDaysAndTime.length > 0
            ? form.actualDaysAndTime
            : undefined,
      };

      // Remove undefined values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      ) as any;

      console.log("Updating classroom with payload:", cleanPayload);

      const response = await updateApiRequest(
        `/api/classrooms/${params.id}`,
        token,
        cleanPayload
      );

      if (response?.data?.success) {
        setSuccess("Classroom updated successfully!");
        setTimeout(() => {
          router.push(`/dashboard/classrooms/${params.id}`);
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to update classroom");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update classroom");
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Edit Classroom
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
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Save className="w-6 h-6 text-green-600" />
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

        {/* Edit Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Schedule Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduleAt"
                    value={form.scheduleAt}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endAt"
                    value={form.endAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Meeting Link Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Meeting Link
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Meeting URL
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Instructor Notes Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Instructor Notes
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="instructorNotes"
                  value={form.instructorNotes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any notes or instructions for this classroom session..."
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>
            </div>

            {/* Recurring Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Recurring Schedule
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addRecurringSchedule}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Schedule
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {form.actualDaysAndTime.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Day
                      </label>
                      <select
                        value={schedule.day}
                        onChange={(e) =>
                          updateRecurringSchedule(index, "day", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) =>
                          updateRecurringSchedule(index, "time", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeRecurringSchedule(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {form.actualDaysAndTime.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No recurring schedule added yet.</p>
                    <p className="text-sm">
                      Click "Add Schedule" to create recurring sessions.
                    </p>
                  </div>
                )}
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving Changes..." : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
