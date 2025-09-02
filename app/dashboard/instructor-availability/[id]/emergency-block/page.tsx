"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";
import { getTokenFromCookies } from "@/lib/cookies";
import {
  AlertTriangle,
  ArrowLeft,
  Shield,
  XCircle,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface InstructorAvailability {
  _id: string;
  instructorId: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
  };
  isActive: boolean;
  emergencyBlockReason?: string;
  emergencyBlockedAt?: Date;
}

export default function EmergencyBlockPage() {
  const params = useParams();
  const router = useRouter();
  const [availability, setAvailability] =
    useState<InstructorAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocking, setBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("24h"); // 24h, 48h, 72h, custom

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Please provide a reason for the emergency block");
      return;
    }

    setBlocking(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        reason: reason.trim(),
        duration: duration,
      };

      const response = await postApiRequest(
        `/api/instructor-availability/${params.id}/emergency-block`,
        token,
        payload
      );

      if (response?.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/instructor-availability/${params.id}`);
        }, 3000);
      } else {
        setError(response?.data?.message || "Failed to block availability");
      }
    } catch (err: any) {
      setError(err.message || "Failed to block availability");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
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
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
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
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
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
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/dashboard/instructor-availability/${params.id}`}>
              <button className="p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Emergency Block
              </h1>
              <p className="text-slate-600">
                Temporarily block instructor availability
              </p>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-3xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Emergency Block Warning
              </h3>
              <p className="text-red-700 mb-3">
                This action will immediately block the instructor's availability
                and prevent any new bookings. This should only be used in
                emergency situations.
              </p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• All existing bookings will remain unaffected</li>
                <li>• The instructor will be notified of this action</li>
                <li>• This block can be removed at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructor Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Instructor Details
          </h3>
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
              <h4 className="font-semibold text-slate-900">
                {availability.instructorId.fullName}
              </h4>
              <p className="text-sm text-slate-600">
                {availability.instructorId.email}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Success!</h3>
              <p className="text-green-700">
                Instructor availability has been emergency blocked.
                Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Block Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
        >
          <div className="space-y-6">
            {/* Reason Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reason for Emergency Block *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a detailed reason for this emergency block..."
                rows={4}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                This reason will be recorded and visible to administrators
              </p>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Block Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="24h">24 hours</option>
                <option value="48h">48 hours</option>
                <option value="72h">72 hours</option>
                <option value="1week">1 week</option>
                <option value="indefinite">
                  Indefinite (until manually removed)
                </option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                The block will automatically expire after the selected duration
              </p>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-200">
              <input
                type="checkbox"
                id="confirm"
                required
                className="w-5 h-5 text-red-600 bg-white border-red-200 rounded focus:ring-red-500 focus:ring-2 mt-0.5"
              />
              <label htmlFor="confirm" className="text-sm text-red-800">
                I understand that this is an emergency action and will
                immediately block the instructor's availability. I confirm that
                this action is necessary and appropriate.
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Link href={`/dashboard/instructor-availability/${params.id}`}>
                <button
                  type="button"
                  className="px-6 py-3 text-slate-700 bg-white/50 border border-slate-200 hover:bg-white/80 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={blocking || !reason.trim()}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {blocking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Blocking...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Emergency Block
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
