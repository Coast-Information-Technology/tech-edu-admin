"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Settings,
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  CalendarDays,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
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
  workingHours: WorkingHours[];
  bufferTimeMinutes: number;
  timezone: string;
  calendlyUserId?: string;
  calendlyUserUri?: string;
  lastAvailabilityUpdate: Date;
  emergencyBlockReason?: string;
  emergencyBlockedAt?: Date;
  isCurrentlyAvailable?: boolean;
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

export default function InstructorAvailabilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [availability, setAvailability] =
    useState<InstructorAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blocking, setBlocking] = useState(false);
  const [unblocking, setUnblocking] = useState(false);

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

  const handleEmergencyBlock = async () => {
    if (!availability) return;

    const reason = prompt("Please provide a reason for the emergency block:");
    if (!reason) return;

    setBlocking(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await postApiRequest(
        `/api/instructor-availability/${params.id}/emergency-block`,
        token,
        { reason }
      );

      if (response?.data?.success) {
        // Refresh the data
        const refreshResponse = await getApiRequest(
          `/api/instructor-availability/${params.id}`,
          token
        );
        if (refreshResponse?.data?.success) {
          setAvailability(refreshResponse.data.data);
        }
      } else {
        setError(response?.data?.message || "Failed to block availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to block availability");
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblock = async () => {
    if (!availability) return;

    setUnblocking(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await postApiRequest(
        `/api/instructor-availability/${params.id}/unblock`,
        token,
        {}
      );

      if (response?.data?.success) {
        // Refresh the data
        const refreshResponse = await getApiRequest(
          `/api/instructor-availability/${params.id}`,
          token
        );
        if (refreshResponse?.data?.success) {
          setAvailability(refreshResponse.data.data);
        }
      } else {
        setError(response?.data?.message || "Failed to unblock availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to unblock availability");
    } finally {
      setUnblocking(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    if (availability?.emergencyBlockReason) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (!availability?.isActive) {
      return "bg-slate-100 text-slate-800 border-slate-200";
    }
    if (availability?.isCurrentlyAvailable) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusText = () => {
    if (availability?.emergencyBlockReason) {
      return "Emergency Blocked";
    }
    if (!availability?.isActive) {
      return "Inactive";
    }
    if (availability?.isCurrentlyAvailable) {
      return "Available Now";
    }
    return "Available";
  };

  const getStatusIcon = () => {
    if (availability?.emergencyBlockReason) {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (!availability?.isActive) {
      return <UserX className="w-4 h-4" />;
    }
    if (availability?.isCurrentlyAvailable) {
      return <UserCheck className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-slate-600 text-lg">
                Loading availability details...
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
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/instructor-availability">
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Instructor Availability
              </h1>
              <p className="text-slate-600">
                View and manage instructor availability settings
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/dashboard/instructor-availability/${params.id}/edit`}
              >
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </Link>
              <Link
                href={`/dashboard/instructor-availability/${params.id}/available-slots`}
              >
                <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  View Slots
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Instructor Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              {availability.instructorId.profilePicture ? (
                <img
                  src={availability.instructorId.profilePicture}
                  alt={availability.instructorId.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-blue-600">
                  {availability.instructorId.fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {availability.instructorId.fullName}
              </h2>
              <p className="text-slate-600">
                {availability.instructorId.email}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor()}`}
                >
                  {getStatusIcon()}
                  {getStatusText()}
                </span>
                {availability.emergencyBlockReason && (
                  <span className="text-sm text-red-600">
                    Blocked: {availability.emergencyBlockReason}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            {availability.emergencyBlockReason ? (
              <button
                onClick={handleUnblock}
                disabled={unblocking}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {unblocking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ShieldOff className="w-4 h-4" />
                )}
                Unblock Availability
              </button>
            ) : (
              <button
                onClick={handleEmergencyBlock}
                disabled={blocking}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {blocking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Emergency Block
              </button>
            )}
          </div>
        </div>

        {/* Availability Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Active Status
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    availability.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {availability.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Timezone
                </span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-900">
                    {availability.timezone}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Buffer Time
                </span>
                <span className="text-sm text-slate-900">
                  {availability.bufferTimeMinutes} minutes
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Last Updated
                </span>
                <span className="text-sm text-slate-900">
                  {formatDate(availability.lastAvailabilityUpdate)}
                </span>
              </div>

              {availability.calendlyUserId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Calendly ID
                  </span>
                  <span className="text-sm text-slate-900">
                    {availability.calendlyUserId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Working Hours
              </h2>
            </div>

            <div className="space-y-3">
              {availability.workingHours.map((hours, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border ${
                    hours.isAvailable
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">
                      {DAYS_OF_WEEK[hours.dayOfWeek]}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hours.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {hours.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  {hours.isAvailable && (
                    <div className="mt-2 text-sm text-slate-600">
                      {hours.startTime} - {hours.endTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Block Information */}
        {availability.emergencyBlockReason && (
          <div className="bg-red-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-200 p-8 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-800">
                Emergency Block
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-red-700">
                <strong>Reason:</strong> {availability.emergencyBlockReason}
              </p>
              {availability.emergencyBlockedAt && (
                <p className="text-red-600 text-sm">
                  <strong>Blocked at:</strong>{" "}
                  {formatDate(availability.emergencyBlockedAt)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
