"use client";
import React, { useEffect, useState } from "react";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import { useRole } from "@/contexts/RoleContext";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Settings,
  UserCheck,
  UserX,
  X,
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

export default function InstructorAvailabilityPage() {
  const { userData, isAuthenticated, loading: authLoading } = useRole();
  const [availabilities, setAvailabilities] = useState<
    InstructorAvailability[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTimezone, setFilterTimezone] = useState("all");
  const [sortKey, setSortKey] = useState("lastAvailabilityUpdate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [profileSettings, setProfileSettings] = useState<any>(null);
  const [showCalendlyStatus, setShowCalendlyStatus] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  useEffect(() => {
    const fetchAvailabilities = async () => {
      // Don't fetch if userData is not loaded yet
      if (!userData._id && !userData.id) {
        // If auth is not loading and user is not authenticated, show error
        if (!authLoading && !isAuthenticated) {
          setError("Please log in to view instructor availability.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Get instructorId from user data (stored during login)
        const instructorId = userData._id || userData.id;

        // Fetch instructor availability using instructorId
        const response = await getApiRequest(
          `/api/instructor-availability/${instructorId}`,
          token
        );

        if (response?.data?.success) {
          // Transform the single instructor availability data to match our interface
          const availability = response.data.data;
          const transformedData = [
            {
              _id: availability._id,
              instructorId: {
                _id: availability.instructorId,
                fullName: userData.fullName,
                email: userData.email,
                profilePicture: userData.avatar,
              },
              isActive: availability.isActive || false,
              workingHours: availability.workingHours || [],
              bufferTimeMinutes: availability.bufferTimeMinutes || 30,
              timezone: availability.timezone || "UTC",
              calendlyUserId: availability.calendlyUserId,
              calendlyUserUri: availability.calendlyUserUri,
              lastAvailabilityUpdate:
                availability.lastAvailabilityUpdate || new Date(),
              emergencyBlockReason: availability.emergencyBlockReason,
              emergencyBlockedAt: availability.emergencyBlockedAt,
              isCurrentlyAvailable: availability.isCurrentlyAvailable || false,
            },
          ];
          setAvailabilities(transformedData);
        } else {
          setError(
            response?.data?.message ||
              "Failed to load instructor availabilities"
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load instructor availabilities");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [userData._id, userData.id, isAuthenticated, authLoading]);

  // Fetch profile settings
  useEffect(() => {
    const fetchProfileSettings = async () => {
      if (!userData._id && !userData.id) {
        return;
      }

      const token = getTokenFromCookies();
      if (!token) {
        return;
      }

      try {
        const instructorId = userData._id || userData.id;
        const response = await getApiRequest(
          `/api/instructors/${instructorId}/profile/settings`,
          token
        );

        if (response?.data?.success) {
          setProfileSettings(response.data.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch profile settings:", err);
      }
    };

    fetchProfileSettings();
  }, [userData._id, userData.id]);

  // Filter and sort logic
  const filteredAvailabilities = availabilities.filter((availability) => {
    const matchesSearch =
      availability.instructorId.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      availability.instructorId.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      availability.timezone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && availability.isActive) ||
      (filterStatus === "inactive" && !availability.isActive) ||
      (filterStatus === "emergency-blocked" &&
        availability.emergencyBlockReason);

    const matchesTimezone =
      filterTimezone === "all" || availability.timezone === filterTimezone;

    return matchesSearch && matchesStatus && matchesTimezone;
  });

  const sortedAvailabilities = [...filteredAvailabilities].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortKey) {
      case "lastAvailabilityUpdate":
        aValue = new Date(a.lastAvailabilityUpdate);
        bValue = new Date(b.lastAvailabilityUpdate);
        break;
      case "instructorName":
        aValue = a.instructorId.fullName;
        bValue = b.instructorId.fullName;
        break;
      case "timezone":
        aValue = a.timezone;
        bValue = b.timezone;
        break;
      case "isActive":
        aValue = a.isActive;
        bValue = b.isActive;
        break;
      default:
        aValue = a[sortKey as keyof InstructorAvailability];
        bValue = b[sortKey as keyof InstructorAvailability];
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedAvailabilities.length / itemsPerPage);
  const paginatedAvailabilities = sortedAvailabilities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusColor = (availability: InstructorAvailability) => {
    if (availability.emergencyBlockReason) {
      return "bg-red-100 text-red-800 border-red-200";
    }
    if (!availability.isActive) {
      return "bg-slate-100 text-slate-800 border-slate-200";
    }
    if (availability.isCurrentlyAvailable) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusText = (availability: InstructorAvailability) => {
    if (availability.emergencyBlockReason) {
      return "Emergency Blocked";
    }
    if (!availability.isActive) {
      return "Inactive";
    }
    if (availability.isCurrentlyAvailable) {
      return "Available Now";
    }
    return "Available";
  };

  const getStatusIcon = (availability: InstructorAvailability) => {
    if (availability.emergencyBlockReason) {
      return <AlertTriangle className="w-4 h-4" />;
    }
    if (!availability.isActive) {
      return <UserX className="w-4 h-4" />;
    }
    if (availability.isCurrentlyAvailable) {
      return <UserCheck className="w-4 h-4" />;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatWorkingHours = (workingHours: WorkingHours[]) => {
    const availableDays = workingHours
      .filter((h) => h.isAvailable)
      .map((h) => DAYS_OF_WEEK[h.dayOfWeek].slice(0, 3))
      .join(", ");
    return availableDays || "No hours set";
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConnectCalendly = async () => {
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!userData._id && !userData.id) {
      setError("Instructor ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the Calendly OAuth connect endpoint
      const response = await postApiRequest(
        `/api/instructors/${
          userData._id || userData.id
        }/calendly-oauth/connect`,
        token,
        {}
      );

      if (response?.data?.success && response.data.authorizationUrl) {
        // Redirect to Calendly authorization URL
        window.location.href = response.data.authorizationUrl;
      } else {
        setError(response?.data?.message || "Failed to connect to Calendly");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to Calendly");
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyBlock = async (instructorId: string, reason: string) => {
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await postApiRequest(
        `/api/instructor-availability/${instructorId}/emergency-block`,
        token,
        { reason }
      );

      if (response?.data?.success) {
        // Refresh the availability data
        const instructorId = userData._id || userData.id;
        if (instructorId) {
          const refreshResponse = await getApiRequest(
            `/api/instructor-availability/${instructorId}`,
            token
          );
          if (refreshResponse?.data?.success) {
            const availability = refreshResponse.data.data;
            const transformedData = [
              {
                _id: availability._id,
                instructorId: {
                  _id: availability.instructorId,
                  fullName: userData.fullName,
                  email: userData.email,
                  profilePicture: userData.avatar,
                },
                isActive: availability.isActive || false,
                workingHours: availability.workingHours || [],
                bufferTimeMinutes: availability.bufferTimeMinutes || 30,
                timezone: availability.timezone || "UTC",
                calendlyUserId: availability.calendlyUserId,
                calendlyUserUri: availability.calendlyUserUri,
                lastAvailabilityUpdate:
                  availability.lastAvailabilityUpdate || new Date(),
                emergencyBlockReason: availability.emergencyBlockReason,
                emergencyBlockedAt: availability.emergencyBlockedAt,
                isCurrentlyAvailable:
                  availability.isCurrentlyAvailable || false,
              },
            ];
            setAvailabilities(transformedData);
          }
        }
      } else {
        setError(
          response?.data?.message || "Failed to emergency block availability"
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to emergency block availability");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (instructorId: string) => {
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await postApiRequest(
        `/api/instructor-availability/${instructorId}/unblock`,
        token,
        {}
      );

      if (response?.data?.success) {
        // Refresh the availability data
        const instructorId = userData._id || userData.id;
        if (instructorId) {
          const refreshResponse = await getApiRequest(
            `/api/instructor-availability/${instructorId}`,
            token
          );
          if (refreshResponse?.data?.success) {
            const availability = refreshResponse.data.data;
            const transformedData = [
              {
                _id: availability._id,
                instructorId: {
                  _id: availability.instructorId,
                  fullName: userData.fullName,
                  email: userData.email,
                  profilePicture: userData.avatar,
                },
                isActive: availability.isActive || false,
                workingHours: availability.workingHours || [],
                bufferTimeMinutes: availability.bufferTimeMinutes || 30,
                timezone: availability.timezone || "UTC",
                calendlyUserId: availability.calendlyUserId,
                calendlyUserUri: availability.calendlyUserUri,
                lastAvailabilityUpdate:
                  availability.lastAvailabilityUpdate || new Date(),
                emergencyBlockReason: availability.emergencyBlockReason,
                emergencyBlockedAt: availability.emergencyBlockedAt,
                isCurrentlyAvailable:
                  availability.isCurrentlyAvailable || false,
              },
            ];
            setAvailabilities(transformedData);
          }
        }
      } else {
        setError(response?.data?.message || "Failed to unblock availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to unblock availability");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeCalendly = async () => {
    const token = getTokenFromCookies();
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    if (!userData._id && !userData.id) {
      setError("Instructor ID not found. Please log in again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to revoke Calendly access? This will disconnect your Calendly account and reset your availability settings."
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/instructors/${userData._id || userData.id}/calendly-oauth/revoke`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        // Refresh both availability and profile settings
        const instructorId = userData._id || userData.id;

        // Refresh availability
        const availabilityResponse = await getApiRequest(
          `/api/instructor-availability/${instructorId}`,
          token
        );
        if (availabilityResponse?.data?.success) {
          const availability = availabilityResponse.data.data;
          const transformedData = [
            {
              _id: availability._id,
              instructorId: {
                _id: availability.instructorId,
                fullName: userData.fullName,
                email: userData.email,
                profilePicture: userData.avatar,
              },
              isActive: availability.isActive || false,
              workingHours: availability.workingHours || [],
              bufferTimeMinutes: availability.bufferTimeMinutes || 30,
              timezone: availability.timezone || "UTC",
              calendlyUserId: availability.calendlyUserId,
              calendlyUserUri: availability.calendlyUserUri,
              lastAvailabilityUpdate:
                availability.lastAvailabilityUpdate || new Date(),
              emergencyBlockReason: availability.emergencyBlockReason,
              emergencyBlockedAt: availability.emergencyBlockedAt,
              isCurrentlyAvailable: availability.isCurrentlyAvailable || false,
            },
          ];
          setAvailabilities(transformedData);
        }

        // Refresh profile settings
        const profileResponse = await getApiRequest(
          `/api/instructors/${instructorId}/profile/settings`,
          token
        );
        if (profileResponse?.data?.success) {
          setProfileSettings(profileResponse.data.data);
        }

        setShowCalendlyStatus(false);
      } else {
        setError(result.message || "Failed to revoke Calendly access");
      }
    } catch (err: any) {
      setError(err.message || "Failed to revoke Calendly access");
    } finally {
      setLoading(false);
    }
  };

  const openEmergencyModal = (instructorId: string) => {
    setSelectedInstructorId(instructorId);
    setEmergencyReason("");
    setShowEmergencyModal(true);
  };

  const closeEmergencyModal = () => {
    setShowEmergencyModal(false);
    setEmergencyReason("");
    setSelectedInstructorId("");
  };

  const handleEmergencyBlockSubmit = async () => {
    if (!emergencyReason.trim()) {
      setError("Please enter a reason for the emergency block.");
      return;
    }

    await handleEmergencyBlock(selectedInstructorId, emergencyReason.trim());
    closeEmergencyModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Instructor Availability
              </h1>
              <p className="text-slate-600 mt-2">
                Manage instructor schedules, working hours, and availability
                status
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/instructor-availability/new">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Availability
                </button>
              </Link>
              {profileSettings?.calendly?.isConnected ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCalendlyStatus(!showCalendlyStatus)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Calendly Connected
                  </button>
                  <button
                    onClick={handleRevokeCalendly}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-5 h-5" />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectCalendly}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-5 h-5" />
                  Connect Calendly
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Calendly Status Panel */}
        {showCalendlyStatus && profileSettings?.calendly && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Calendly Integration Status
              </h3>
              <button
                onClick={() => setShowCalendlyStatus(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition-all duration-300"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      profileSettings.calendly.isConnected
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="font-medium text-slate-700">
                    Status:{" "}
                    {profileSettings.calendly.isConnected
                      ? "Connected"
                      : "Disconnected"}
                  </span>
                </div>

                {profileSettings.calendly.calendlyUserId && (
                  <div>
                    <span className="text-sm font-medium text-slate-600">
                      Calendly User ID:
                    </span>
                    <p className="text-slate-900 font-mono text-sm">
                      {profileSettings.calendly.calendlyUserId}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">
                    Availability Status:
                  </span>
                  <p className="text-slate-900">
                    {profileSettings.availability?.isActive
                      ? "Active"
                      : "Inactive"}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-600">
                    Timezone:
                  </span>
                  <p className="text-slate-900">
                    {profileSettings.availability?.timezone || "Not set"}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-slate-600">
                    Buffer Time:
                  </span>
                  <p className="text-slate-900">
                    {profileSettings.availability?.bufferTimeMinutes || 30}{" "}
                    minutes
                  </p>
                </div>

                {profileSettings.availability?.emergencyBlock?.isBlocked && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <span className="text-sm font-medium text-red-800">
                      Emergency Blocked
                    </span>
                    <p className="text-red-700 text-sm">
                      {profileSettings.availability.emergencyBlock.reason}
                    </p>
                    {profileSettings.availability.emergencyBlock.blockedAt && (
                      <p className="text-red-600 text-xs mt-1">
                        Blocked at:{" "}
                        {new Date(
                          profileSettings.availability.emergencyBlock.blockedAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Available Now
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {availabilities.filter((a) => a.isCurrentlyAvailable).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-900">
                  {availabilities.filter((a) => a.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Emergency Blocked
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {availabilities.filter((a) => a.emergencyBlockReason).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Timezones</p>
                <p className="text-2xl font-bold text-slate-900">
                  {new Set(availabilities.map((a) => a.timezone)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search instructors..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="emergency-blocked">Emergency Blocked</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={filterTimezone}
                    onChange={(e) => {
                      setFilterTimezone(e.target.value);
                      setPage(1);
                    }}
                    className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="all">All Timezones</option>
                    {Array.from(
                      new Set(availabilities.map((a) => a.timezone))
                    ).map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="px-6 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="lastAvailabilityUpdate">Sort by Update</option>
                  <option value="instructorName">Sort by Name</option>
                  <option value="timezone">Sort by Timezone</option>
                  <option value="isActive">Sort by Status</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                }
                className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center"
              >
                {sortDirection === "asc" ? (
                  <SortAsc className="h-5 w-5 text-slate-600" />
                ) : (
                  <SortDesc className="h-5 w-5 text-slate-600" />
                )}
              </button>
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

        {/* Availabilities Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 text-lg">
                  Loading availabilities...
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Working Hours
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Timezone
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {paginatedAvailabilities.length > 0 ? (
                    paginatedAvailabilities.map((availability) => (
                      <tr
                        key={availability._id}
                        className="hover:bg-blue-50/50 transition-all duration-300 group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
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
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                                {availability.instructorId.fullName}
                              </div>
                              <div className="text-sm text-slate-500">
                                {availability.instructorId.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                              availability
                            )}`}
                          >
                            {getStatusIcon(availability)}
                            {getStatusText(availability)}
                          </span>
                          {availability.emergencyBlockReason && (
                            <div className="text-xs text-red-600 mt-1">
                              {availability.emergencyBlockReason}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatWorkingHours(availability.workingHours)}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Buffer: {availability.bufferTimeMinutes} min
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">
                              {availability.timezone}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDate(availability.lastAvailabilityUpdate)}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/instructor-availability/${availability.instructorId._id}`}
                            >
                              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300 group-hover:bg-blue-100">
                                <Eye className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                              </button>
                            </Link>
                            <Link
                              href={`/dashboard/instructor-availability/edit`}
                            >
                              <button className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 group-hover:bg-green-100">
                                <Edit className="w-4 h-4 text-slate-600 group-hover:text-green-600 transition-colors duration-300" />
                              </button>
                            </Link>
                            {availability.emergencyBlockReason ? (
                              <button
                                onClick={() =>
                                  handleUnblock(availability.instructorId._id)
                                }
                                disabled={loading}
                                className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 group-hover:bg-green-100 disabled:opacity-50"
                                title="Unblock availability"
                              >
                                <CheckCircle className="w-4 h-4 text-slate-600 group-hover:text-green-600 transition-colors duration-300" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  openEmergencyModal(
                                    availability.instructorId._id
                                  )
                                }
                                disabled={loading}
                                className="p-2 rounded-full hover:bg-red-100 transition-all duration-300 group-hover:bg-red-100 disabled:opacity-50"
                                title="Emergency block availability"
                              >
                                <AlertTriangle className="w-4 h-4 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              No availabilities found
                            </h3>
                            <p className="text-slate-600">
                              {searchTerm ||
                              filterStatus !== "all" ||
                              filterTimezone !== "all"
                                ? "Try adjusting your filters"
                                : "No instructor availabilities have been set up yet"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(
                    (page - 1) * itemsPerPage + 1,
                    sortedAvailabilities.length
                  )}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(page * itemsPerPage, sortedAvailabilities.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900">
                  {sortedAvailabilities.length}
                </span>{" "}
                availabilities
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Block Modal */}
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Emergency Block Availability
                </h3>
              </div>

              <p className="text-slate-600 mb-4">
                Please provide a reason for the emergency block. This will
                immediately block the instructor's availability.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reason for Emergency Block *
                </label>
                <textarea
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="Enter the reason for emergency blocking..."
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeEmergencyModal}
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmergencyBlockSubmit}
                  disabled={loading || !emergencyReason.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Blocking...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Emergency Block
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
