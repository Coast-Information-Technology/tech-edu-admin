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
  Globe,
  Settings,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface InstructorAvailabilityForm {
  instructorId: string;
  isActive: boolean;
  workingHours: WorkingHours[];
  bufferTimeMinutes: number;
  timezone: string;
  calendlyUserId: string;
  calendlyUserUri: string;
}

interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
];

export default function NewInstructorAvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [form, setForm] = useState<InstructorAvailabilityForm>({
    instructorId: "",
    isActive: true,
    workingHours: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Monday
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Tuesday
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Wednesday
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Thursday
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isAvailable: true }, // Friday
    ],
    bufferTimeMinutes: 30,
    timezone: "UTC",
    calendlyUserId: "",
    calendlyUserUri: "",
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await getApiRequest("/api/instructors", token);

        if (response?.data?.success) {
          setInstructors(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load instructors");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleWorkingHoursChange = (
    dayIndex: number,
    field: keyof WorkingHours,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((hours, index) =>
        index === dayIndex ? { ...hours, [field]: value } : hours
      ),
    }));
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setForm((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((hours, index) =>
        index === dayIndex
          ? { ...hours, isAvailable: !hours.isAvailable }
          : hours
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.instructorId) {
      setError("Please select an instructor");
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
        instructorId: form.instructorId,
        isActive: form.isActive,
        workingHours: form.workingHours,
        bufferTimeMinutes: form.bufferTimeMinutes,
        timezone: form.timezone,
        calendlyUserId: form.calendlyUserId || undefined,
        calendlyUserUri: form.calendlyUserUri || undefined,
      };

      const response = await postApiRequest(
        "/api/instructor-availability",
        token,
        payload
      );

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/instructor-availability");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to create availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create availability");
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
                Loading instructors...
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
            <Link href="/dashboard/instructor-availability">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add Instructor Availability
              </h1>
              <p className="text-slate-600">
                Set up working hours and availability for an instructor
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
                Instructor availability created successfully. Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Basic Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Instructor *
                </label>
                <select
                  name="instructorId"
                  value={form.instructorId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select an instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.fullName} ({instructor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Timezone *
                </label>
                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Buffer Time (minutes)
                </label>
                <input
                  type="number"
                  name="bufferTimeMinutes"
                  value={form.bufferTimeMinutes}
                  onChange={handleChange}
                  min="0"
                  max="120"
                  step="15"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Time between sessions (default: 30 minutes)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-white border-slate-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-semibold text-slate-700">
                  Active Availability
                </label>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Working Hours
              </h2>
            </div>

            <div className="space-y-4">
              {form.workingHours.map((hours, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl p-4 bg-white/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={hours.isAvailable}
                        onChange={() => toggleDayAvailability(index)}
                        className="w-5 h-5 text-blue-600 bg-white border-slate-200 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <h4 className="font-medium text-slate-700">
                        {DAYS_OF_WEEK[hours.dayOfWeek]}
                      </h4>
                    </div>
                  </div>

                  {hours.isAvailable && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={hours.startTime}
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={hours.endTime}
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendly Integration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Calendly Integration (Optional)
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Calendly User ID
                </label>
                <input
                  type="text"
                  name="calendlyUserId"
                  value={form.calendlyUserId}
                  onChange={handleChange}
                  placeholder="Enter Calendly user ID"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Calendly User URI
                </label>
                <input
                  type="url"
                  name="calendlyUserUri"
                  value={form.calendlyUserUri}
                  onChange={handleChange}
                  placeholder="https://calendly.com/username"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex justify-end gap-4">
              <Link href="/dashboard/instructor-availability">
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
                    Create Availability
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
