"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  ArrowLeft,
  CalendarDays,
  Search,
  Filter,
  XCircle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked?: boolean;
}

interface DaySlots {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
}

interface InstructorAvailability {
  _id: string;
  instructorId: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
  };
  isActive: boolean;
  workingHours: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  bufferTimeMinutes: number;
  timezone: string;
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

export default function AvailableSlotsPage() {
  const params = useParams();
  const [availability, setAvailability] =
    useState<InstructorAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchAvailability = async () => {
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
          `/api/instructor-availability/${params.id}`,
          token
        );

        if (response?.data?.success) {
          setAvailability(response.data.data);
        } else {
          setError(response?.data?.message || "Failed to load availability");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAvailability();
    }
  }, [params.id]);

  useEffect(() => {
    if (availability) {
      fetchAvailableSlots();
    }
  }, [availability, durationMinutes, selectedDate]);

  const fetchAvailableSlots = async () => {
    if (!availability) return;

    const token = getTokenFromCookies();
    if (!token) return;

    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 7); // Get slots for 2 weeks

      const response = await getApiRequest(
        `/api/instructor-availability/${
          params.id
        }/available-slots?date=${startDate.toISOString()}&durationMinutes=${durationMinutes}`,
        token
      );

      if (response?.data?.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch available slots:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getDaySlots = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return availableSlots.find((day) => day.date === dateString);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">
                Loading availability data...
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
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
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

  if (!availability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-3xl p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Not Found
              </h3>
              <p className="text-slate-700">Availability not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/dashboard/instructor-availability/${params.id}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Available Time Slots
              </h1>
              <p className="text-slate-600">
                View available booking slots for{" "}
                {availability.instructorId.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                {availability.instructorId.profilePicture ? (
                  <img
                    src={availability.instructorId.profilePicture}
                    alt={availability.instructorId.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-blue-600">
                    {availability.instructorId.fullName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {availability.instructorId.fullName}
                </h3>
                <p className="text-sm text-slate-600">
                  {availability.instructorId.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Session Duration
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Calendar</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-slate-600 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <div key={index} className="aspect-square">
                    {date ? (
                      <button
                        onClick={() => setSelectedDate(date)}
                        className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-300 ${
                          isToday(date)
                            ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                            : isSelected(date)
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-100 text-slate-900"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Available Slots
                </h2>
                <div className="text-sm text-slate-600">
                  {formatDate(selectedDate.toISOString())}
                </div>
              </div>

              {(() => {
                const daySlots = getDaySlots(selectedDate);
                if (!daySlots) {
                  return (
                    <div className="text-center py-12">
                      <CalendarDays className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">
                        No availability data for this date
                      </p>
                    </div>
                  );
                }

                const availableSlots = daySlots.slots.filter(
                  (slot) => slot.isAvailable && !slot.isBooked
                );

                if (availableSlots.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-slate-600">
                        No available slots for this date
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        All slots are either booked or outside working hours
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="p-3 bg-green-50 border border-green-200 rounded-xl text-center hover:bg-green-100 transition-colors duration-300 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-green-800">
                          {formatTime(slot.startTime)}
                        </div>
                        <div className="text-xs text-green-600">
                          to {formatTime(slot.endTime)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Working Hours Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Working Hours
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {availability.workingHours.map((hours, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border ${
                  hours.isAvailable
                    ? "bg-green-50 border-green-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="text-sm font-medium text-slate-900">
                  {DAYS_OF_WEEK[hours.dayOfWeek]}
                </div>
                {hours.isAvailable ? (
                  <div className="text-xs text-green-600 mt-1">
                    {hours.startTime} - {hours.endTime}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 mt-1">Unavailable</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
