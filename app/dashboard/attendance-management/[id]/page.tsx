"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, deleteApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  CalendarDays,
  UserCheck,
  FileText,
  MapPin,
  Settings,
  ExternalLink,
  Phone,
  Mail,
  User,
  Building,
  Clock3,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";

interface Participant {
  participantType: string;
  platformRole: string;
  email: string;
  fullName: string;
  profileId?: string;
}

interface Calendar {
  eventId: string;
  joinUrl: string;
  synced: boolean;
}

interface Attendance {
  _id: string;
  classroomId?: string;
  sessionId?: string;
  productType: string;
  ledBy: string;
  scheduleAt: string;
  endAt: string;
  durationInMinutes: number;
  status: string;
  rescheduledMeetingLink?: string;
  title: string;
  remarks?: string;
  isPostponed?: boolean;
  postponedTo?: {
    date: string;
    reason: string;
  };
  rescheduledFrom?: string;
  bookerType: string;
  bookerPlatformRole: string;
  bookerProfileId?: string;
  bookerEmail: string;
  bookerFullName: string;
  participants: Participant[];
  numberOfExpectedParticipants: number;
  calendar?: Calendar;
  createdAt: string;
  updatedAt: string;
}

export default function ViewAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        setAttendance(response.data.data);
      } else {
        setError(response?.data?.message || "Failed to load attendance");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    const token = getTokenFromCookies();
    if (!token) {
      setDeleteError("Authentication required. Please log in.");
      setDeleteLoading(false);
      return;
    }

    try {
      const response = await deleteApiRequest(
        `/api/attendance/${params.id}`,
        token
      );
      console.log("Delete attendance response:", response);

      if (response?.data?.success) {
        router.push("/dashboard/attendance-management");
      } else {
        setDeleteError(
          response?.data?.message || "Failed to delete attendance"
        );
      }
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete attendance");
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "missed":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "postponed":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Calendar className="w-5 h-5" />;
      case "in_progress":
        return <Play className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "missed":
        return <XCircle className="w-5 h-5" />;
      case "postponed":
        return <Pause className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case "AcademicService":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      case "TrainingProgram":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "Consultancy":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      default:
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200";
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/attendance-management">
                <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Attendance Details
                </h1>
                <p className="text-slate-600">
                  View comprehensive attendance information
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/dashboard/attendance-management/${attendance._id}/edit`}
              >
                <button className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all duration-300 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </Link>
              <button
                onClick={() => setDeleteDialogOpen(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {deleteError && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{deleteError}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Session Information
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {attendance.title}
                  </h3>
                  <p className="text-slate-600">
                    Session ID: {attendance.sessionId}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Product Type</p>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getProductTypeColor(
                          attendance.productType
                        )}`}
                      >
                        {attendance.productType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Led By</p>
                      <p className="font-semibold text-slate-900">
                        {attendance.ledBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock3 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Duration</p>
                      <p className="font-semibold text-slate-900">
                        {attendance.durationInMinutes} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        Expected Participants
                      </p>
                      <p className="font-semibold text-slate-900">
                        {attendance.numberOfExpectedParticipants}
                      </p>
                    </div>
                  </div>
                </div>

                {attendance.remarks && (
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="font-semibold text-slate-900">
                        Remarks
                      </span>
                    </div>
                    <p className="text-slate-700">{attendance.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Schedule</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-900">
                      Start Time
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(attendance.scheduleAt)}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-slate-900">
                      End Time
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(attendance.endAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                      attendance.status
                    )}`}
                  >
                    {getStatusIcon(attendance.status)}
                    {attendance.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {attendance.isPostponed && attendance.postponedTo && (
                <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Pause className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-slate-900">
                      Postponed To
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900 mb-2">
                    {formatDate(attendance.postponedTo.date)}
                  </p>
                  <p className="text-slate-700">
                    Reason: {attendance.postponedTo.reason}
                  </p>
                </div>
              )}
            </div>

            {/* Participants */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Participants
                </h2>
              </div>

              <div className="space-y-4">
                {attendance.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Participant {index + 1}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {participant.participantType} •{" "}
                        {participant.platformRole}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-semibold text-slate-900">
                            {participant.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Full Name</p>
                          <p className="font-semibold text-slate-900">
                            {participant.fullName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booker Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Booker</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-semibold text-slate-900">
                    {attendance.bookerFullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">
                    {attendance.bookerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-semibold text-slate-900 capitalize">
                    {attendance.bookerType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Platform Role</p>
                  <p className="font-semibold text-slate-900 capitalize">
                    {attendance.bookerPlatformRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Meeting Information */}
            {attendance.calendar && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Meeting</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Event ID</p>
                    <p className="font-semibold text-slate-900">
                      {attendance.calendar.eventId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Sync Status</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        attendance.calendar.synced
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {attendance.calendar.synced ? "Synced" : "Not Synced"}
                    </span>
                  </div>

                  {attendance.calendar.joinUrl && (
                    <a
                      href={attendance.calendar.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Timestamps</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Created</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(attendance.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <p className="font-semibold text-slate-900">
                    {formatDate(attendance.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Delete Attendance
                </h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete this attendance record? This
                  action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
