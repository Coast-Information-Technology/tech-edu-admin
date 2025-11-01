"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getApiRequest, putApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
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
  calendly?: {
    userId: string;
    userUri: string;
    connectedAt: string;
    lastSyncAt: string;
  };
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

export default function EditInstructorAvailabilityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<InstructorAvailabilityForm>({
    instructorId: userData._id || userData.id || "",
    isActive: true,
    workingHours: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isAvailable: true },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isAvailable: true },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isAvailable: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isAvailable: true },
    ],
    bufferTimeMinutes: 30,
    timezone: "UTC",
    calendly: undefined,
  });

  // Get instructorId from URL params or user data
  const instructorId =
    searchParams.get("instructorId") || userData._id || userData.id;

  // Load existing availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!instructorId) {
        setError("Instructor ID not found.");
        setLoading(false);
        return;
      }

      const token = getTokenFromCookies();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await getApiRequest(
          `/api/instructor-availability/${instructorId}`,
          token
        );

        if (response?.data?.success) {
          const availability = response.data.data;
          setForm({
            instructorId: instructorId || "",
            isActive: availability.isActive || false,
            workingHours: availability.workingHours || [
              {
                dayOfWeek: 1,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              },
              {
                dayOfWeek: 2,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              },
              {
                dayOfWeek: 3,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              },
              {
                dayOfWeek: 4,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              },
              {
                dayOfWeek: 5,
                startTime: "09:00",
                endTime: "17:00",
                isAvailable: true,
              },
            ],
            bufferTimeMinutes: availability.bufferTimeMinutes || 30,
            timezone: availability.timezone || "UTC",
            calendly: availability.calendly,
          });
        } else {
          setError(
            response?.data?.message || "Failed to load availability data"
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [instructorId]);

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
    value: string | boolean | number
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

  const addWorkingHours = () => {
    setForm((prev) => ({
      ...prev,
      workingHours: [
        ...prev.workingHours,
        {
          dayOfWeek: 0, // Sunday
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: true,
        },
      ],
    }));
  };

  const removeWorkingHours = (index: number) => {
    setForm((prev) => ({
      ...prev,
      workingHours: prev.workingHours.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!instructorId) {
      setError("Instructor ID not found. Please try refreshing the page.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = {
        instructorId: form.instructorId,
        isActive: form.isActive,
        workingHours: form.workingHours,
        bufferTimeMinutes: form.bufferTimeMinutes,
        timezone: form.timezone,
        calendly: form.calendly,
      };

      const response = await putApiRequest(
        `/api/instructor-availability/${instructorId}`,
        payload,
        token
      );

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/instructor-availability");
        }, 2000);
      } else {
        setError(response?.data?.message || "Failed to update availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading availability data...</p>
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
                Edit Instructor Availability
              </h1>
              <p className="text-slate-600">
                Update working hours and availability settings
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
                Instructor availability updated successfully. Redirecting...
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
                      <select
                        value={hours.dayOfWeek}
                        onChange={(e) =>
                          handleWorkingHoursChange(
                            index,
                            "dayOfWeek",
                            parseInt(e.target.value)
                          )
                        }
                        className="px-3 py-1 bg-white border border-slate-200 rounded-[10px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {DAYS_OF_WEEK.map((day, dayIndex) => (
                          <option key={dayIndex} value={dayIndex}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWorkingHours(index)}
                      className="p-1 rounded-full hover:bg-red-100 transition-all duration-300"
                      title="Remove this working hour"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
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
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[12px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[12px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Working Hours Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={addWorkingHours}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Working Hours
                </button>
              </div>
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

            <div className="space-y-4">
              {form.calendly ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">
                      Calendly Connected
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-600">
                        User ID:
                      </span>
                      <p className="text-slate-900 font-mono">
                        {form.calendly.userId}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">
                        User URI:
                      </span>
                      <p className="text-slate-900 font-mono">
                        {form.calendly.userUri}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">
                        Connected At:
                      </span>
                      <p className="text-slate-900">
                        {new Date(form.calendly.connectedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">
                        Last Sync:
                      </span>
                      <p className="text-slate-900">
                        {new Date(form.calendly.lastSyncAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600">
                    No Calendly integration configured
                  </p>
                  <p className="text-sm text-slate-500">
                    Connect Calendly from the main availability page
                  </p>
                </div>
              )}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Availability
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
