"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postApiRequest } from "@/lib/apiFetch";
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
  FileText,
  Tag,
} from "lucide-react";
import Link from "next/link";

interface FormData {
  bookingId: string;
  productId: string;
  productType: string;
  bookingPurpose: string;
  instructorId: string;
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  numberOfExpectedParticipants: number;
  meetingLink: string;
  status: string;
  instructorNotes: string;
  internalNotes: string;
  actualDaysAndTime: Array<{
    day: string;
    time: string;
  }>;
}

const PRODUCT_TYPE_OPTIONS = [
  "AcademicService",
  "TrainingProgram",
  "Consultancy",
  "Coaching",
  "Mentorship",
  "Workshop",
  "Seminar",
  "Webinar",
  "Course",
  "Bootcamp",
];

const STATUS_OPTIONS = ["upcoming", "active", "completed", "cancelled"];

export default function CreateClassroomPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    bookingId: "",
    productId: "",
    productType: "",
    bookingPurpose: "",
    instructorId: "",
    scheduleAt: "",
    endAt: "",
    minutesPerSession: 60,
    numberOfExpectedParticipants: 1,
    meetingLink: "",
    status: "upcoming",
    instructorNotes: "",
    internalNotes: "",
    actualDaysAndTime: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "minutesPerSession" || name === "numberOfExpectedParticipants"
          ? parseInt(value) || 0
          : value,
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

    // Validation
    const requiredFields = [
      { field: "bookingId", label: "Booking ID" },
      { field: "productId", label: "Product ID" },
      { field: "productType", label: "Product Type" },
      { field: "bookingPurpose", label: "Booking Purpose" },
      { field: "instructorId", label: "Instructor ID" },
      { field: "scheduleAt", label: "Schedule At" },
      { field: "status", label: "Status" },
    ];

    const missingFields = requiredFields.filter(({ field, label }) => {
      const value = form[field as keyof FormData];
      const isMissing =
        !value || (typeof value === "string" && value.trim() === "");
      return isMissing;
    });

    if (missingFields.length > 0) {
      setError(
        `Please fill all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      setSaving(false);
      return;
    }

    try {
      const payload = {
        ...form,
        scheduleAt: new Date(form.scheduleAt).toISOString(),
        endAt: form.endAt ? new Date(form.endAt).toISOString() : undefined,
        minutesPerSession: Number(form.minutesPerSession) || 60,
        numberOfExpectedParticipants:
          Number(form.numberOfExpectedParticipants) || 1,
        actualDaysAndTime:
          form.actualDaysAndTime.length > 0
            ? form.actualDaysAndTime
            : undefined,
      };

      // Remove undefined values
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      ) as any;

      console.log("Creating classroom with payload:", cleanPayload);

      const response = await postApiRequest(
        "/api/classrooms",
        token,
        cleanPayload
      );

      if (response?.data?.success) {
        setSuccess("Classroom created successfully!");
        setTimeout(() => {
          router.push("/dashboard/classrooms");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to create classroom");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create classroom");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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
                  Create New Classroom
                </h1>
                <p className="text-slate-600">
                  Set up a new training session or classroom activity
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/classrooms">
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
                  {saving ? "Creating..." : "Create Classroom"}
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

        {/* Create Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Basic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Booking ID *
                  </label>
                  <input
                    type="text"
                    name="bookingId"
                    value={form.bookingId}
                    onChange={handleChange}
                    required
                    placeholder="Enter booking ID"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                    required
                    placeholder="Enter product ID"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Product Type</option>
                    {PRODUCT_TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Booking Purpose *
                  </label>
                  <input
                    type="text"
                    name="bookingPurpose"
                    value={form.bookingPurpose}
                    onChange={handleChange}
                    required
                    placeholder="Enter booking purpose (e.g., Data Science Fundamentals Training)"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Instructor ID *
                  </label>
                  <input
                    type="text"
                    name="instructorId"
                    value={form.instructorId}
                    onChange={handleChange}
                    required
                    placeholder="Enter instructor ID"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            </div>

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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Minutes Per Session
                  </label>
                  <input
                    type="number"
                    name="minutesPerSession"
                    value={form.minutesPerSession}
                    onChange={handleChange}
                    min="1"
                    placeholder="60"
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expected Participants
                  </label>
                  <input
                    type="number"
                    name="numberOfExpectedParticipants"
                    value={form.numberOfExpectedParticipants}
                    onChange={handleChange}
                    min="1"
                    placeholder="15"
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

            {/* Notes Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Instructor Notes
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    name="internalNotes"
                    value={form.internalNotes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any internal notes or administrative details..."
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
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
              <Link href="/dashboard/classrooms" className="flex-1">
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
                  {saving ? "Creating Classroom..." : "Create Classroom"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
